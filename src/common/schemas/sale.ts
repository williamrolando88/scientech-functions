import { z } from 'zod';
import { ZOD_ERROR } from '../constants/errors';
import { CI_RUC_REGEX } from '../constants/regex';
import { DocumentRefSchema } from './documentRef';

export const billingDocumentSchema = z.object({
  id: z.string().optional(),
  issueDate: z.coerce.date(),
  recipientName: z.string(),
  recipientId: z
    .string(ZOD_ERROR.REQUIRED)
    .regex(CI_RUC_REGEX, ZOD_ERROR.CI_RUC),
  establishment: z.coerce.number().positive(),
  emissionPoint: z.coerce.number().positive(),
  sequentialNumber: z.coerce.number().positive(),
  description: z.string(),
  IVA: z.number().positive(),
  taxedSubtotal: z.number().positive(),
  total: z.number().positive(),
  ref: DocumentRefSchema.optional(),
  saleAccount: z.string(),
  paid: z.boolean().default(false),
});

const WithholdingSchema = z.object({
  id: z.string(),
  issueDate: z.coerce.date(),
  issuerName: z.string(),
  issuerId: z.string(ZOD_ERROR.REQUIRED).regex(CI_RUC_REGEX, ZOD_ERROR.CI_RUC),
  establishment: z.coerce.number().positive(),
  emissionPoint: z.coerce.number().positive(),
  sequentialNumber: z.coerce.number().positive(),
  IVAWithholding: z.number().nonnegative().optional(),
  RentWithholding: z.number().nonnegative().optional(),
  total: z.number().positive(),
  ref: DocumentRefSchema.optional(),
});

const PaymentCollectionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  paymentDate: z.coerce.date(),
  ref: DocumentRefSchema,
});

export const SaleSchema = z.object({
  id: z.string().optional(),
  billingDocument: billingDocumentSchema,
  withholding: WithholdingSchema,
  paymentCollection: PaymentCollectionSchema,
  advancePayments: PaymentCollectionSchema.array(),
  paymentDue: z.number().nonnegative(),
});
