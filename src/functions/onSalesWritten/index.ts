import { EventHandlerFunction } from '../../common/types/functions';
import { Sale } from '../../common/types/sale';
import { billingDocument } from './actionHandlers/billingDocumentActions';
import { withholding } from './actionHandlers/withholdingActions';

export const onSalesWrittenFunction: EventHandlerFunction = async (event) => {
  await billingDocumentHandler(event);

  const afterDoc = event.data?.after.data();
  if (afterDoc) return;

  await withholdingHandler(event);
  await paymentCollectionHandler(event);
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

  const beforeWithholdingDoc = beforeDoc?.withholding;
  const afterWithholdingDoc = afterDoc?.withholding;

  if (!beforeWithholdingDoc && !afterWithholdingDoc) {
    console.info('No withholding registered');
    return;
  }

  if (!beforeWithholdingDoc) {
    await withholding.create(afterDoc as Sale);
    return;
  }

  if (beforeWithholdingDoc && afterWithholdingDoc) {
    await withholding.update(afterDoc as Sale);
    return;
  }

  if (!afterWithholdingDoc) {
    await withholding.remove(beforeDoc as Sale);
    return;
  }
};

const paymentCollectionHandler: EventHandlerFunction = async (event) => {
  const beforeDoc = event.data?.before.data();
  const afterDoc = event.data?.after.data();
};
