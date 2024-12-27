import { EventHandlerFunction } from '../../common/types/functions';
import { Purchase } from '../../common/types/purchases';
import { purchaseCreation } from './actionHandlers/purchaseCreation';
import { purchaseDeletion } from './actionHandlers/purchaseDeletion';
import { purchaseUpdate } from './actionHandlers/purchaseUpdate';

export const onPurchaseWrittenFunction: EventHandlerFunction = async (
  event
) => {
  const afterDoc = event.data?.after.data();
  const beforeDoc = event.data?.before.data();

  if (!beforeDoc) {
    console.info(`Purchase document ${afterDoc?.id} created`);
    await purchaseCreation(afterDoc as Purchase);
    return;
  }

  if (beforeDoc && afterDoc) {
    console.info(`Purchase document ${afterDoc?.id} updated`);
    await purchaseUpdate(afterDoc as Purchase);
    return;
  }

  if (!afterDoc) {
    console.info(`Purchase document ${beforeDoc?.id} deleted`);
    await purchaseDeletion(beforeDoc as Purchase);
    return;
  }
};
