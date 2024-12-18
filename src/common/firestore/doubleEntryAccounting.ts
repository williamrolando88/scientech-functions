import { COLLECTIONS } from '../enums/firestoreCollections';
import { db } from '../firebase';
import { DocumentRef } from '../types/DocumentRef';
import { DoubleEntryAccounting } from '../types/doubleEntryAccounting';

export const getByRef = async (
  refType: keyof DocumentRef | undefined,
  refId: string | undefined
): Promise<DoubleEntryAccounting | null> => {
  if (!refType || !refId) {
    return null;
  }

  const doubleEntryAccountingSnapshot = await db
    .collection(COLLECTIONS.DOUBLE_ENTRY_ACCOUNTING)
    .where(`ref.${refType}`, '==', refId)
    .where('source', '==', refType.slice(0, -2))
    .get();

  if (doubleEntryAccountingSnapshot.empty) {
    return null;
  }

  return doubleEntryAccountingSnapshot.docs[0].data() as DoubleEntryAccounting;
};

export const doubleEntryAccounting = {
  getByRef,
};
