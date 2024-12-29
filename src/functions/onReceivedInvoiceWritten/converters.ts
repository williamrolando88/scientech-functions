import { DEFAULT_ACCOUNT } from '../../common/constants/settings';
import { DoubleEntryAccounting } from '../../common/types/doubleEntryAccounting';
import {
  CustomsPayment,
  NonDeductible,
  Payment,
  Purchase,
  ReceivedInvoice,
  SaleNote,
} from '../../common/types/purchases';

const documentIdentifier = (purchase: Purchase) => {
  switch (purchase.type) {
    case 'receivedInvoice':
      return `Factura recibida:${purchase.purchaseData.establishment}-${purchase.purchaseData.emissionPoint}-${purchase.purchaseData.sequentialNumber}`;
    case 'saleNote':
      return `Nota de venta:${purchase.purchaseData.establishment}-${purchase.purchaseData.emissionPoint}-${purchase.purchaseData.sequentialNumber}`;
    case 'customsPayment':
      return `Liquidación aduanera:${purchase.purchaseData.customsPaymentNumber}`;
    case 'nonDeductible':
      return `Gasto no deducible:\n\n${purchase.purchaseData.description}`;
    default:
      return '';
  }
};

const receivedInvoice2DoubleEntryData = (
  purchase: Purchase
): Omit<DoubleEntryAccounting, 'createdAt'> => {
  const invoice = purchase.purchaseData as ReceivedInvoice;

  return {
    id: purchase.id ?? '',
    issueDate: invoice.issueDate,
    description: `${documentIdentifier(purchase)}\n\n${invoice.description}`,
    ref: {
      ...invoice.ref,
      purchaseId: purchase.id,
    },
    transactions: [
      {
        accountId: DEFAULT_ACCOUNT.BILLS_TO_PAY,
        debit: 0,
        credit: invoice.total,
      },
      {
        accountId: DEFAULT_ACCOUNT.IVA_TAX_CREDIT,
        debit: invoice.IVA ?? 0,
        credit: 0,
      },
      {
        accountId: invoice.expenseAccount,
        debit: invoice.total - (invoice.IVA ?? 0),
        credit: 0,
      },
    ],
    accounts: [
      DEFAULT_ACCOUNT.BILLS_TO_PAY,
      DEFAULT_ACCOUNT.IVA_TAX_CREDIT,
      invoice.expenseAccount,
    ],
    locked: true,
    updatedAt: new Date(),
  };
};

const saleNote2DoubleEntryData = (
  purchase: Purchase
): Omit<DoubleEntryAccounting, 'createdAt'> => {
  const saleNote = purchase.purchaseData as SaleNote;

  return {
    id: purchase.id ?? '',
    issueDate: saleNote.issueDate,
    description: `${documentIdentifier(purchase)}\n\n${saleNote.description}`,
    ref: {
      ...saleNote.ref,
      purchaseId: purchase.id,
    },
    transactions: [
      {
        accountId: DEFAULT_ACCOUNT.BILLS_TO_PAY,
        debit: 0,
        credit: saleNote.total,
      },
      {
        accountId: saleNote.expenseAccount,
        debit: saleNote.total,
        credit: 0,
      },
    ],
    accounts: [DEFAULT_ACCOUNT.BILLS_TO_PAY, saleNote.expenseAccount],
    locked: true,
    updatedAt: new Date(),
  };
};

const customsPayment2DoubleEntryData = (
  purchase: Purchase
): Omit<DoubleEntryAccounting, 'createdAt'> => {
  const customsPayment = purchase.purchaseData as CustomsPayment;

  return {
    id: purchase.id ?? '',
    issueDate: customsPayment.issueDate,
    description: `${documentIdentifier(purchase)}\n\n${customsPayment.description}`,
    ref: {
      ...customsPayment.ref,
      purchaseId: purchase.id,
    },
    transactions: [
      {
        accountId: DEFAULT_ACCOUNT.BILLS_TO_PAY,
        debit: 0,
        credit: customsPayment.total,
      },
      {
        accountId: DEFAULT_ACCOUNT.IVA_TAX_CREDIT,
        debit: customsPayment.IVA,
        credit: 0,
      },
      {
        accountId: DEFAULT_ACCOUNT.CUSTOMS_PAYMENT.EXPENSE,
        debit: customsPayment.total - customsPayment.IVA,
        credit: 0,
      },
    ],
    accounts: [
      DEFAULT_ACCOUNT.BILLS_TO_PAY,
      DEFAULT_ACCOUNT.IVA_TAX_CREDIT,
      DEFAULT_ACCOUNT.CUSTOMS_PAYMENT.EXPENSE,
    ],
    locked: true,
    updatedAt: new Date(),
  };
};

const nonDeductible2DoubleEntryData = (
  purchase: Purchase
): Omit<DoubleEntryAccounting, 'createdAt'> => {
  const nonDeductible = purchase.purchaseData as NonDeductible;

  return {
    id: purchase.id ?? '',
    issueDate: nonDeductible.issueDate,
    description: documentIdentifier(purchase),
    ref: {
      ...nonDeductible.ref,
      purchaseId: purchase.id,
    },
    transactions: [
      {
        accountId: DEFAULT_ACCOUNT.BILLS_TO_PAY,
        debit: 0,
        credit: nonDeductible.total,
      },
      {
        accountId: nonDeductible.expenseAccount,
        debit: nonDeductible.total,
        credit: 0,
      },
    ],
    accounts: [DEFAULT_ACCOUNT.BILLS_TO_PAY, nonDeductible.expenseAccount],
    locked: true,
    updatedAt: new Date(),
  };
};

export const purchaseData2DoubleEntryData = (
  purchase: Purchase
): Omit<DoubleEntryAccounting, 'createdAt'> => {
  switch (purchase.type) {
    case 'receivedInvoice':
      return receivedInvoice2DoubleEntryData(purchase);
    case 'customsPayment':
      return customsPayment2DoubleEntryData(purchase);
    case 'nonDeductible':
      return nonDeductible2DoubleEntryData(purchase);
    case 'saleNote':
      return saleNote2DoubleEntryData(purchase);
    default:
      return receivedInvoice2DoubleEntryData(purchase);
  }
};

export const payment2DoubleEntry = (
  purchase: Purchase
): Omit<DoubleEntryAccounting, 'createdAt'> => {
  const payment = purchase.payment as Payment;

  return {
    id: payment.id,
    issueDate: payment.paymentDate,
    description: `Pago a ${documentIdentifier(purchase).toLowerCase()}`,
    ref: { ...payment.ref, paymentId: purchase.id },
    transactions: [
      {
        accountId: DEFAULT_ACCOUNT.BILLS_TO_PAY,
        debit: payment.amount,
        credit: 0,
      },
      {
        accountId: payment.paymentAccount,
        debit: 0,
        credit: payment.amount,
      },
    ],
    accounts: [DEFAULT_ACCOUNT.BILLS_TO_PAY, payment.paymentAccount],
    locked: true,
    updatedAt: new Date(),
  };
};
