import { z } from 'zod';
import { ReceivedInvoiceSchema } from '../schemas/purchases/receivedInvoice';
import { CustomsPaymentSchema } from '../schemas/purchases/customsPayment';
import { NonDeductibleSchema } from '../schemas/purchases/nonDeductible';
import { SaleNoteSchema } from '../schemas/purchases/saleNote';

export type ReceivedInvoice = z.infer<typeof ReceivedInvoiceSchema>;
export type CustomsPayment = z.infer<typeof CustomsPaymentSchema>;
export type NonDeductible = z.infer<typeof NonDeductibleSchema>;
export type SaleNote = z.infer<typeof SaleNoteSchema>;
