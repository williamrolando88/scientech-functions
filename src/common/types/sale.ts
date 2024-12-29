import { z } from 'zod';
import {
  BillingDocumentSchema,
  PaymentCollectionSchema,
  SaleSchema,
  WithholdingSchema,
} from '../schemas/sale';

export type BillingDocument = z.infer<typeof BillingDocumentSchema>;
export type Withholding = z.infer<typeof WithholdingSchema>;
export type PaymentCollection = z.infer<typeof PaymentCollectionSchema>;
export type Sale = z.infer<typeof SaleSchema>;
