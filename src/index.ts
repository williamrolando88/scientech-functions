import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onReceivedInvoiceWrittenFunction } from './functions/onReceivedInvoiceWritten';

export const onReceivedInvoiceWritten = onDocumentWritten(
  {
    document: 'receivedInvoices/{invoiceId}',
    timeoutSeconds: 10,
  },
  onReceivedInvoiceWrittenFunction
);
