import { COLLECTIONS_ENUM } from '../../../common/enums/firestoreCollections';
import { DB } from '../../../common/firebase';
import { DoubleEntryAccounting } from '../../../common/types/doubleEntryAccounting';
import { Sale } from '../../../common/types/sale';
import { paymentCollection2DoubleEntryData } from '../converters';

const create = async (sale: Sale) => {
  console.info(`Payment collection document for ${sale.id} created`);

  const paymentCollectionEntry: DoubleEntryAccounting = {
    ...paymentCollection2DoubleEntryData(sale),
    createdAt: new Date(),
  };

  const docRef = DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING).doc(
    paymentCollectionEntry.id ?? ''
  );

  console.info(`Creating entry ${docRef.id}`);
  await docRef.set(paymentCollectionEntry);
};

const update = async (sale: Sale) => {
  console.info(`Payment collection document for ${sale.id} updated`);

  const docRef = DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING).doc(
    sale.paymentCollection?.id ?? ''
  );

  console.info(`Updating entry ${docRef.id}`);
  await docRef.update(paymentCollection2DoubleEntryData(sale));
};

const remove = async (sale: Sale) => {
  console.info(`Payment collection document for ${sale.id} deleted`);

  const docRef = DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING).doc(
    sale.paymentCollection?.id ?? ''
  );

  console.info(`Deleting entry ${docRef.id}`);
  await docRef.delete();
};

export const paymentCollection = {
  create,
  update,
  remove,
};
