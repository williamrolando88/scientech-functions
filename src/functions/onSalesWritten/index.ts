import { EventHandlerFunction } from '../../common/types/functions';
import { Sale } from '../../common/types/sale';
import { billingDocument } from './actionHandlers/billingDocumentActions';

export const onSalesWrittenFunction: EventHandlerFunction = async (event) => {
  await billingDocumentHandler(event);

  const afterDoc = event.data?.after.data();
  if (afterDoc) return;

  await withholdingHandler(event);
  await paymentCollectionHandler(event);
  await advancePaymentsHandler(event);
};

const billingDocumentHandler: EventHandlerFunction = async (event) => {
  const beforeDoc = event.data?.before.data();
  const afterDoc = event.data?.after.data();

  if (!beforeDoc) {
    await billingDocument.create(afterDoc as Sale);
    return;
  }

  if (beforeDoc && afterDoc) {
    await billingDocument.update(afterDoc as Sale);
    return;
  }

  if (!afterDoc) {
    await billingDocument.remove(beforeDoc as Sale);
    return;
  }
};

const withholdingHandler: EventHandlerFunction = async (event) => {
  const beforeDoc = event.data?.before.data();
  const afterDoc = event.data?.after.data();
};

const paymentCollectionHandler: EventHandlerFunction = async (event) => {
  const beforeDoc = event.data?.before.data();
  const afterDoc = event.data?.after.data();
};

const advancePaymentsHandler: EventHandlerFunction = async (event) => {
  const beforeDoc = event.data?.before.data();
  const afterDoc = event.data?.after.data();
};
