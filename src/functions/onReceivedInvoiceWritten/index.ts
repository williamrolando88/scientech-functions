import { EventHandlerFunction } from '../../common/types/functions';
import { Purchase } from '../../common/types/purchases';
import { paymentActions } from './actionHandlers/paymentActions';
import { purchaseDataEntry } from './actionHandlers/purchaseDataActions';

export const onPurchaseWrittenFunction: EventHandlerFunction = async (
  event
) => {
  await purchaseDataHandler(event);
  await paymentHandler(event);
};

const purchaseDataHandler: EventHandlerFunction = async (event) => {
  const afterDoc = event.data?.after.data();
  const beforeDoc = event.data?.before.data();

  if (!beforeDoc) {
    await purchaseDataEntry.create(afterDoc as Purchase);
    return;
  }

  if (beforeDoc && afterDoc) {
    await purchaseDataEntry.update(afterDoc as Purchase);
    return;
  }

  if (!afterDoc) {
    await purchaseDataEntry.remove(beforeDoc as Purchase);
    return;
  }
};

const paymentHandler: EventHandlerFunction = async (event) => {
  const afterDoc = event.data?.after.data();
  const beforeDoc = event.data?.before.data();

  if (!afterDoc) return;

  const afterPaymentDoc = afterDoc?.payment;
  const beforePaymentDoc = beforeDoc?.payment;

  if (!beforePaymentDoc) {
    await paymentActions.create(afterDoc as Purchase);
    return;
  }

  if (beforePaymentDoc && afterPaymentDoc) {
    await paymentActions.update(afterDoc as Purchase);
    return;
  }

  if (!afterPaymentDoc) {
    await paymentActions.remove(afterDoc as Purchase);
    return;
  }
};
