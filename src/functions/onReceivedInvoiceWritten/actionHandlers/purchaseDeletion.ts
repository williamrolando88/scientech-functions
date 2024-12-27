import { COLLECTIONS_ENUM } from '../../../common/enums/firestoreCollections';
import { DB } from '../../../common/firebase';
import { Purchase } from '../../../common/types/purchases';

export const purchaseDeletion = async (purchase: Purchase) => {
  const batch = DB.batch();
  const querySnapshot = await DB.collection(
    COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING
  )
    .where('ref.purchaseId', '==', purchase.id)
    .get();

  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
};
