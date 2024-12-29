import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onPurchaseWrittenFunction } from './functions/onPurchaseWritten';
import { onSalesWrittenFunction } from './functions/onSalesWritten';

export const onPurchaseWritten = onDocumentWritten(
  {
    document: 'purchases/{purchaseId}',
    timeoutSeconds: 10,
  },
  onPurchaseWrittenFunction
);

export const onSalesWritten = onDocumentWritten(
  {
    document: 'sales/{saleId}',
    timeoutSeconds: 10,
  },
  onSalesWrittenFunction
);
