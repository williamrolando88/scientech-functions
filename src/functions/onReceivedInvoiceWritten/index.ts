import { EventHandlerFunction } from '../../common/types/functions';
import { Purchase } from '../../common/types/purchases';
import { purchaseCreation } from './actionHandlers/purchaseCreation';
import { purchaseDeletion } from './actionHandlers/purchaseDeletion';

/**
 * TODO: Create an structure that performs the following tasks
 *
 * Purchase
 * - Create: before - ; after +
 * - Update: before + ; after +
 * - Delete: before + ; after -
 *
 * For create/update it should create/update a doubleEntryAccount doc,
 * the entry must have the same purchase id for easy query
 * For deletions it should delete cascade the document id and any reference
 * to it.
 *
 * Payment
 * - Pay: before +/- ; after +
 * - Unpay: before + ; after -
 *
 * To register a payment upsert, it should query the
 * ref.paymentId: purchaseId
 * If no doc exists, it must create a new one.
 * If more than a document exists, it should delete all except one and
 * return the conserved reference.
 *
 * For unpay, it should delete all the documents with
 * ref.paymentId: purchaseId
 *
 */

export const onPurchaseWrittenFunction: EventHandlerFunction = async (
  event
) => {
  const afterDoc = event.data?.after.data();
  const beforeDoc = event.data?.before.data();

  if (!beforeDoc) {
    console.info(`Purchase document ${afterDoc?.id} created`);
    // Always creates a purchase
    await purchaseCreation(afterDoc as Purchase);
    return;
  }

  if (beforeDoc && afterDoc) {
    // It can mean purchase and/or payment update
    console.info(`Purchase document ${afterDoc?.id} updated`);
    return;
  }

  if (!afterDoc) {
    // Always deletes a purchase
    console.info(`Purchase document ${beforeDoc?.id} deleted`);
    await purchaseDeletion(beforeDoc as Purchase);
    return;
  }
};
