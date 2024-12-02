import { COLLECTIONS } from '../enums/firestoreCollections';
import { db } from '../firebase';
import { DocumentRef } from '../types/DocumentRef';
import { DoubleEntryAccounting } from '../types/doubleEntryAccounting';

export const getDoubleEntryAccountingByRef = async (
  refType: keyof DocumentRef | undefined,
  refId: string | undefined
): Promise<DoubleEntryAccounting | null> => {
  if (!refType || !refId) {
    return null;
  }

  const referencePath = `ref.${refType}`;

  const doubleEntryAccountingSnapshot = await db
    .collection(COLLECTIONS.DOUBLE_ENTRY_ACCOUNTING)
    .where(referencePath, '==', refId)
    .get();

  if (doubleEntryAccountingSnapshot.empty) {
    return null;
  }

  return doubleEntryAccountingSnapshot.docs[0].data() as DoubleEntryAccounting;
};
