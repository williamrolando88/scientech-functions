import { z } from 'zod';
import {
  DoubleEntryAccountingSchema,
  TransactionSchema,
} from '../schemas/doubleEntryAccounting';

export type DoubleEntryAccountingTransaction = z.infer<
  typeof TransactionSchema
>;
export type DoubleEntryAccounting = z.infer<typeof DoubleEntryAccountingSchema>;

export type ExpandedTransaction = DoubleEntryAccountingTransaction &
  Omit<DoubleEntryAccounting, 'transactions'>;
