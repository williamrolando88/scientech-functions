import { EventHandlerFunction } from '../../common/types/functions';
import { Purchase } from '../../common/types/purchases';
import { receivedInvoiceActions } from './actionHandlers';
import { purchaseCreation } from './actionHandlers/purchaseCreation';

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
  const afterInvoice = event.data?.after.data();
  const beforeInvoice = event.data?.before.data();

  const docLogId = `Purchase document ${afterInvoice?.id}`;

  if (!beforeInvoice) {
    console.log(`${docLogId} created`);
    // Always creates a purchase
    purchaseCreation(afterInvoice as Purchase);
    return;
  }

  if (!afterInvoice) {
    // It can mean purchase and/or payment update
    console.log(`${docLogId} updated`);
    receivedInvoiceActions.remove(beforeInvoice as Purchase);
    return;
  }

  if (beforeInvoice && afterInvoice) {
    // Always deletes a purchase
    console.log(`${docLogId} deleted`);
    receivedInvoiceActions.update(afterInvoice as Purchase);
    return;
  }
};
