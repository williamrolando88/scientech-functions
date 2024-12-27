import { COLLECTIONS_ENUM } from '../../../common/enums/firestoreCollections';
import { DB } from '../../../common/firebase';
import { DoubleEntryAccounting } from '../../../common/types/doubleEntryAccounting';
import { Purchase } from '../../../common/types/purchases';
import {
  payment2DoubleEntry,
  purchaseData2DoubleEntryData,
} from '../converters';

export const purchaseUpdate = async (purchase: Purchase) => {
  const batch = DB.batch();

  const purchaseDocRef = DB.collection(
    COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING
  ).doc(purchase.id ?? '');

  batch.update(purchaseDocRef, purchaseData2DoubleEntryData(purchase));

  if (!purchase.payment) {
    batch.commit();
    return;
  }

  const querySnapshot = await DB.collection(
    COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING
  )
    .where('ref.paymentId', '==', purchase.id)
    .get();

  let paymentDocRef;
  const paymentEntry: Partial<DoubleEntryAccounting> =
    payment2DoubleEntry(purchase);

  if (querySnapshot.empty) {
    paymentDocRef = DB.collection(
      COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING
    ).doc();

    paymentEntry.createdAt = new Date();
    paymentEntry.id = paymentDocRef.id;
  } else {
    paymentDocRef = querySnapshot.docs[0].ref;
  }

  batch.set(paymentDocRef, paymentEntry, { merge: true });

  batch.commit();
  return;
};
