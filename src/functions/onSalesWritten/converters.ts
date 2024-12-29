import { DEFAULT_ACCOUNT } from '../../common/constants/settings';
import { DoubleEntryAccounting } from '../../common/types/doubleEntryAccounting';
import { Sale } from '../../common/types/sale';

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
    description: `${documentIdentifier(sale)}\n\n${data.description}`,
    ref: { ...data.ref, sellId: sale.id },
    transactions,
    accounts,
    locked: true,
    updatedAt: new Date(),
  };
};
