import { COLLECTIONS_ENUM } from '../../common/enums/firestoreCollections';
import { DB } from '../../common/firebase';
import { DoubleEntryAccounting } from '../../common/types/doubleEntryAccounting';
import { ReceivedInvoice } from '../../common/types/purchases';

const create = async (invoice: ReceivedInvoice) => {
  const doubleEntryData: DoubleEntryAccounting = {
    ...invoice2DoubleEntryData(invoice),
    createdAt: new Date(),
  };

  await DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING)
    .doc(invoice.id ?? '')
    .set(doubleEntryData);
};

const update = async (invoice: ReceivedInvoice) => {
  const doubleEntryData = invoice2DoubleEntryData(invoice);

  await DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING)
    .doc(invoice.id ?? '')
    .set(doubleEntryData, { merge: true });
};

const remove = async (invoice: ReceivedInvoice) => {
  await DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING)
    .doc(invoice.id ?? '')
    .delete();
};

export const receivedInvoiceActions = {
  create,
  update,
  remove,
};
