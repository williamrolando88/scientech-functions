import { logger } from 'firebase-functions/v2';
import { db } from '../../common/firebase';
import { EventHandlerFunction } from '../../common/types/functions';

export const onReceivedInvoiceWrittenFunction: EventHandlerFunction = async (
  event
) => {
  const afterInvoice = event.data?.after.data();
  const beforeInvoice = event.data?.before.data();

  if (!beforeInvoice) {
    console.log('Creating invoice...');
  }

  if (!afterInvoice) {
    console.log('Deleting invoice...');
  }

  if (beforeInvoice && afterInvoice) {
    console.log('Updating invoice...');
  }

  logger.info('Invoice written', {
    afterInvoice,
    beforeInvoice,
  });

  const categoriesSnapshot = await db
    .collection('applicationSettings')
    .doc('accountCategories')
    .get();

  logger.info('Account categories', categoriesSnapshot.data());

  console.log('finished!!');
  return;
};
