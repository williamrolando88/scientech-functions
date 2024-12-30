import { COLLECTIONS_ENUM } from '../../../common/enums/firestoreCollections';
import { DB } from '../../../common/firebase';
import { DoubleEntryAccounting } from '../../../common/types/doubleEntryAccounting';
import { Purchase } from '../../../common/types/purchases';
import { payment2DoubleEntry } from '../converters';

const create = async (purchase: Purchase) => {
  console.info(`Payment document for ${purchase?.id} created`);

  const paymentEntry: DoubleEntryAccounting = {
    ...payment2DoubleEntry(purchase),
    createdAt: new Date(),
  };

  const docRef = DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING).doc(
    purchase.payment?.id ?? ''
  );

  console.info(`Creating entry ${docRef.id}`);
  await docRef.set(paymentEntry);
};

const update = async (purchase: Purchase) => {
  console.info(`Payment document for ${purchase?.id} updated`);

  const docRef = DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING).doc(
    purchase.payment?.id ?? ''
  );

  console.info(`Updating entry ${docRef.id}`);
  docRef.set(payment2DoubleEntry(purchase), { merge: true });
};

const remove = async (purchase: Purchase) => {
  console.info(`Payment document for ${purchase?.id} deleted`);

  const docRef = DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING).doc(
    purchase.payment?.id ?? ''
  );

  await docRef.delete();
};

export const paymentActions = {
  create,
  update,
  remove,
};
