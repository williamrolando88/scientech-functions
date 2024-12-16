import {
  BILLS_TO_PAY_ACCOUNT_ID,
  TAX_CREDIT_ACCOUNT_ID,
} from '../../common/constants/accountCategories';
import { COLLECTIONS } from '../../common/enums/firestoreCollections';
import { db } from '../../common/firebase';
import { DoubleEntryAccounting } from '../../common/types/doubleEntryAccounting';
import { ReceivedInvoice } from '../../common/types/purchases';

const invoice2DoubleEntryData = (
  invoice: ReceivedInvoice
): Omit<DoubleEntryAccounting, 'createdAt'> => ({
  id: invoice.id ?? '',
  issueDate: invoice.issueDate,
  description: invoice.description,
  ref: {
    invoiceId: invoice.id,
    ...invoice.ref,
  },
  transactions: [
    {
      accountId: BILLS_TO_PAY_ACCOUNT_ID,
      credit: invoice.total,
      debit: 0,
    },
    {
      accountId: TAX_CREDIT_ACCOUNT_ID,
      credit: invoice.IVA ?? 0,
      debit: 0,
    },
    {
      accountId: invoice.expenseAccount,
      credit: invoice.total - (invoice.IVA ?? 0),
      debit: 0,
    },
  ],
  accounts: [
    BILLS_TO_PAY_ACCOUNT_ID,
    TAX_CREDIT_ACCOUNT_ID,
    invoice.expenseAccount,
  ],
  locked: true,
  updatedAt: new Date(),
});

const create = async (invoice: ReceivedInvoice) => {
  const doubleEntryData: DoubleEntryAccounting = {
    ...invoice2DoubleEntryData(invoice),
    createdAt: new Date(),
  };

  await db
    .collection(COLLECTIONS.DOUBLE_ENTRY_ACCOUNTING)
    .doc(invoice.id ?? '')
    .set(doubleEntryData);
};

const update = async (invoice: ReceivedInvoice) => {
  const doubleEntryData = invoice2DoubleEntryData(invoice);

  await db
    .collection(COLLECTIONS.DOUBLE_ENTRY_ACCOUNTING)
    .doc(invoice.id ?? '')
    .set(doubleEntryData, { merge: true });
};

const remove = async (invoice: ReceivedInvoice) => {
  await db
    .collection(COLLECTIONS.DOUBLE_ENTRY_ACCOUNTING)
    .doc(invoice.id ?? '')
    .delete();
};

export const receivedInvoiceActions = {
  create,
  update,
  remove,
};
