/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import { logger } from 'firebase-functions/v2';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { db } from './common/firebase';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((_, response) => {
  logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

export const onInvoiceWritten = onDocumentWritten(
  {
    document: 'invoices/{invoiceId}',
    timeoutSeconds: 10,
  },
  async (event) => {
    const afterInvoice = event.data?.after.data();

    const beforeInvoice = event.data?.before.data();

    logger.info('Invoice written', {
      afterInvoice,
      beforeInvoice,
    });

    const categoriesSnapshot = await db
      .collection('applicationSettings')
      .doc('accountCategories')
      .get();

    logger.info('Account categories', categoriesSnapshot.data());

    console.log('finished!!');
    return;
  }
);
