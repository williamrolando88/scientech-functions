import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onReceivedInvoiceWrittenFunction } from './functions/onReceivedInvoiceWritten';

export const onReceivedInvoiceWritten = onDocumentWritten(
  {
    document: 'invoices/{invoiceId}',
    timeoutSeconds: 10,
  },
  onReceivedInvoiceWrittenFunction
);
