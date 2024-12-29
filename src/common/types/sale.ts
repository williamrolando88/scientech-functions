import { z } from 'zod';
import { SaleSchema } from '../schemas/sale';

export type Sale = z.infer<typeof SaleSchema>;
