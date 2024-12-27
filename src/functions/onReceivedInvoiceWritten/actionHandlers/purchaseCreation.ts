import { COLLECTIONS_ENUM } from '../../../common/enums/firestoreCollections';
import { DB } from '../../../common/firebase';
import { DoubleEntryAccounting } from '../../../common/types/doubleEntryAccounting';
import { Purchase } from '../../../common/types/purchases';
import { purchaseData2DoubleEntryData } from '../converters';

export const purchaseCreation = async (purchase: Purchase) => {
  const doubleEntryData: DoubleEntryAccounting = {
    ...purchaseData2DoubleEntryData(purchase),
    createdAt: new Date(),
  };

  await DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING)
    .doc(purchase.id ?? '')
    .set(doubleEntryData);
};
