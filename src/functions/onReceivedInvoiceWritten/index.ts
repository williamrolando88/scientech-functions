import { EventHandlerFunction } from '../../common/types/functions';
import { ReceivedInvoice } from '../../common/types/purchases';
import { receivedInvoiceActions } from './actionHandlers';

export const onPurchaseWrittenFunction: EventHandlerFunction = async (
  event
) => {
  const afterInvoice = event.data?.after.data();
  const beforeInvoice = event.data?.before.data();

  if (!beforeInvoice) {
    console.log('Creating invoice: ', afterInvoice?.id);
    receivedInvoiceActions.create(afterInvoice as ReceivedInvoice);
    return;
  }

  if (beforeInvoice && afterInvoice) {
    console.log('Updating invoice: ', afterInvoice?.id);
    receivedInvoiceActions.update(afterInvoice as ReceivedInvoice);
    return;
  }

  if (!afterInvoice) {
    console.log('Deleting invoice: ', beforeInvoice?.id);
    receivedInvoiceActions.remove(beforeInvoice as ReceivedInvoice);
    return;
  }
};
