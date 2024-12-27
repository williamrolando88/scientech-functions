import { COLLECTIONS_ENUM } from '../../../common/enums/firestoreCollections';
import { DB } from '../../../common/firebase';
import { DoubleEntryAccounting } from '../../../common/types/doubleEntryAccounting';
import { Purchase } from '../../../common/types/purchases';
import { payment2DoubleEntry } from '../converters';

const create = async (purchase: Purchase) => {
  console.info(`Payment document for ${purchase?.id} created`);
  const docRef = DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING).doc(
    purchase.id ?? ''
  );

  const paymentEntry: DoubleEntryAccounting = {
    ...payment2DoubleEntry(purchase),
    createdAt: new Date(),
    id: docRef.id,
  };

  console.info(`Creating entry ${docRef.id}`);
  await docRef.set(paymentEntry);
};

const update = async (purchase: Purchase) => {
  console.info(`Payment document for ${purchase?.id} updated`);
  const querySnapshot = await DB.collection(
    COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING
  )
    .where('ref.paymentId', '==', purchase.id)
    .get();

  const paymentDocRef = querySnapshot.docs[0].ref;

  console.info(`Updating entry ${paymentDocRef.id}`);
  paymentDocRef.set(payment2DoubleEntry(purchase), { merge: true });
};

const remove = async (purchase: Purchase) => {
  console.info(`Payment document for ${purchase?.id} deleted`);

  const batch = DB.batch();
  const querySnapshot = await DB.collection(
    COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING
  )
    .where('ref.paymentId', '==', purchase.id)
    .get();

  querySnapshot.forEach((doc) => {
    console.info(`Deleting entry ${doc.id}`);
    batch.delete(doc.ref);
  });

  await batch.commit();
};

export const paymentActions = {
  create,
  update,
  remove,
};
