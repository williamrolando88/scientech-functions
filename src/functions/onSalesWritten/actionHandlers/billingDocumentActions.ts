import { COLLECTIONS_ENUM } from '../../../common/enums/firestoreCollections';
import { DB } from '../../../common/firebase';
import { DoubleEntryAccounting } from '../../../common/types/doubleEntryAccounting';
import { Sale } from '../../../common/types/sale';
import { billingDocument2DoubleEntryData } from '../converters';

const create = async (sale: Sale) => {
  console.info(`Sell document ${sale.id} created`);

  const docRef = DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING).doc(
    sale.id ?? ''
  );

  const saleEntryData: DoubleEntryAccounting = {
    ...billingDocument2DoubleEntryData(sale),
    createdAt: new Date(),
  };

  console.info(`Creating entry ${docRef.id}`);
  await docRef.set(saleEntryData);
};

const update = async (sale: Sale) => {
  console.info(`Sell document ${sale.id} updated`);

  const docRef = DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING).doc(
    sale.id ?? ''
  );

  console.info(`Updating entry ${docRef.id}`);
  await docRef.update(billingDocument2DoubleEntryData(sale));
};

const remove = async (sale: Sale) => {
  console.info(`Sell document ${sale?.id} deleted`);

  const batch = DB.batch();
  const querySnapshot = await DB.collection(
    COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING
  )
    .where('ref.sellId', '==', sale.id)
    .get();

  querySnapshot.forEach((doc) => {
    console.info(`Deleting entry ${doc.id}`);
    batch.delete(doc.ref);
  });

  await batch.commit();
};

export const billingDocument = {
  create,
  update,
  remove,
};
