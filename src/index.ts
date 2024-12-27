import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onPurchaseWrittenFunction } from './functions/onReceivedInvoiceWritten';

export const onPurchaseWritten = onDocumentWritten(
  {
    document: 'purchases/{purchaseId}',
    timeoutSeconds: 10,
  },
  onPurchaseWrittenFunction
);
