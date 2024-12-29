import { DEFAULT_ACCOUNT } from '../../common/constants/settings';
import { DoubleEntryAccounting } from '../../common/types/doubleEntryAccounting';
import { PaymentCollection, Sale, Withholding } from '../../common/types/sale';

const documentIdentifier = ({ billingDocument }: Sale) =>
  `Factura emitida: ${billingDocument.establishment}-${billingDocument.emissionPoint}-${billingDocument.sequentialNumber}`;

export const billingDocument2DoubleEntryData = (
  sale: Sale
): Omit<DoubleEntryAccounting, 'createdAt'> => {
  const data = sale.billingDocument;

  const transactions = [
    {
      accountId: DEFAULT_ACCOUNT.ACCOUNTS_RECEIVABLE,
      debit: data.total,
      credit: 0,
    },
    {
      accountId: data.saleAccount,
      debit: 0,
      credit: data.taxedSubtotal,
    },
    {
      accountId: DEFAULT_ACCOUNT.TAXES_PAYABLE,
      debit: 0,
      credit: data.IVA,
    },
  ];

  const accounts = transactions.map((t) => t.accountId);

  return {
    id: sale.id,
    issueDate: data.issueDate,
    description: `${documentIdentifier(sale)}\nA: ${data.recipientName}\n\n${data.description}`,
    ref: { ...data.ref, sellId: sale.id },
    transactions,
    accounts,
    locked: true,
    updatedAt: new Date(),
  };
};

const withholding2DoubleEntryData = (
  sale: Sale
): Omit<DoubleEntryAccounting, 'createdAt'> => {
  const data = sale.withholding as Withholding;

  const transactions = [
    {
      accountId: DEFAULT_ACCOUNT.ACCOUNTS_RECEIVABLE,
      debit: 0,
      credit: data.total,
    },
    {
      accountId: DEFAULT_ACCOUNT.IVA_TAX_CREDIT,
      debit: data.IVAWithholding ?? 0,
      credit: 0,
    },
    {
      accountId: DEFAULT_ACCOUNT.INCOME_TAX_CREDIT,
      debit: data.IncomeWithholding ?? 0,
      credit: 0,
    },
  ];

  const accounts = transactions.map((t) => t.accountId);

  return {
    id: data.id,
    issueDate: data.issueDate,
    description: '',
    ref: {
      ...data.ref,
      withholdingId: data.id,
    },
    transactions,
    accounts,
    locked: true,
    updatedAt: new Date(),
  };
};

const paymentCollection2DoubleEntryData = (
  sale: Sale
): Omit<DoubleEntryAccounting, 'createdAt'> => {
  const data = sale.paymentCollection as PaymentCollection;

  const transactions = [
    {
      accountId: data.paymentAccount,
      debit: data.amount,
      credit: 0,
    },
    {
      accountId: DEFAULT_ACCOUNT.ACCOUNTS_RECEIVABLE,
      debit: 0,
      credit: data.amount,
    },
  ];

  if (!sale.advancePayments?.length) {
    const advanceAmount =
      sale.advancePayments?.reduce((acc, p) => acc + p.amount, 0) ?? 0;

    transactions.push({
      accountId: DEFAULT_ACCOUNT.CUSTOMER_ADVANCE,
      debit: advanceAmount,
      credit: 0,
    });
  }

  const accounts = transactions.map((t) => t.accountId);

  return {
    id: data.id,
    issueDate: data.paymentDate,
    description: '',
    ref: {
      ...data.ref,
      paymentCollectionId: data.id,
    },
    transactions,
    accounts,
    locked: true,
    updatedAt: new Date(),
  };
};
