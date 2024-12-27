import { z } from 'zod';
import { PaymentSchema } from '../schemas/payment';

export type Payment = z.infer<typeof PaymentSchema>;
