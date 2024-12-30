import { COLLECTIONS_ENUM } from '../../../common/enums/firestoreCollections';
import { DB } from '../../../common/firebase';
import { DoubleEntryAccounting } from '../../../common/types/doubleEntryAccounting';
import { Sale } from '../../../common/types/sale';
import { withholding2DoubleEntryData } from '../converters';

const create = async (sale: Sale) => {
  console.info(`Withholding document for ${sale.id} created`);

  const withholdingEntry: DoubleEntryAccounting = {
    ...withholding2DoubleEntryData(sale),
    createdAt: new Date(),
  };

  const docRef = DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING).doc(
    withholdingEntry.id ?? ''
  );

  console.info(`Creating entry ${docRef.id}`);
  await docRef.set(withholdingEntry);
};

const update = async (sale: Sale) => {
  console.info(`Withholding document for ${sale.id} updated`);

  const docRef = DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING).doc(
    sale.withholding?.id ?? ''
  );

  console.info(`Updating entry ${docRef.id}`);
  await docRef.update(withholding2DoubleEntryData(sale));
};

const remove = async (sale: Sale) => {
  console.info(`Withholding document for ${sale.id} deleted`);

  const docRef = DB.collection(COLLECTIONS_ENUM.DOUBLE_ENTRY_ACCOUNTING).doc(
    sale.withholding?.id ?? ''
  );

  console.info(`Deleting entry ${docRef.id}`);
  await docRef.delete();
};

export const withholding = {
  create,
  update,
  remove,
};
