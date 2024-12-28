import { COLLECTIONS_ENUM } from '../../../common/enums/firestoreCollections';
import { DB } from '../../../common/firebase';
import { DoubleEntryAccounting } from '../../../common/types/doubleEntryAccounting';
import { Purchase } from '../../../common/types/purchases';
import { purchaseData2DoubleEntryData } from '../converters';

const create = async (purchase: Purchase) => {
  console.info(`Purchase document ${purchase?.id} created`);

  const docRef = DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING).doc(
    purchase.id ?? ''
  );

  const doubleEntryData: DoubleEntryAccounting = {
    ...purchaseData2DoubleEntryData(purchase),
    createdAt: new Date(),
  };

  console.info(`Creating entry ${docRef.id}`);
  await docRef.set(doubleEntryData);
};

const update = async (purchase: Purchase) => {
  console.info(`Purchase document ${purchase?.id} updated`);

  const purchaseDocRef = DB.collection(
    COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING
  ).doc(purchase.id ?? '');

  console.info(`Updating entry ${purchaseDocRef.id}`);
  await purchaseDocRef.update(purchaseData2DoubleEntryData(purchase));
};

export const remove = async (purchase: Purchase) => {
  console.info(`Purchase document ${purchase?.id} deleted`);

  const batch = DB.batch();
  const querySnapshot = await DB.collection(
    COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING
  )
    .where('ref.purchaseId', '==', purchase.id)
    .get();

  querySnapshot.forEach((doc) => {
    console.info(`Deleting entry ${doc.id}`);
    batch.delete(doc.ref);
  });

  await batch.commit();
};

export const purchaseDataEntry = {
  create,
  update,
  remove,
};
