import {
  BILLS_TO_PAY_ACCOUNT_ID,
  TAX_CREDIT_ACCOUNT_ID,
} from '../../common/constants/accountCategories';
import { db } from '../../common/firebase';
import { DoubleEntryAccounting } from '../../common/types/doubleEntryAccounting';
import { ReceivedInvoice } from '../../common/types/purchases';

const create = async (invoice: ReceivedInvoice) => {
  const doubleEntryData: DoubleEntryAccounting = {
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
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db
    .collection('doubleEntryAccounting')
    .doc(invoice.id ?? '')
    .set(doubleEntryData);
};

const update = async (invoice: ReceivedInvoice) => {};

const remove = async (invoice: ReceivedInvoice) => {};

export const receivedInvoiceActions = {
  create,
  update,
  remove,
};
