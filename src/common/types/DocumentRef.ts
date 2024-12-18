import { z } from 'zod';
import { DocumentRefSchema } from '../schemas/documentRef';

export type DocumentRef = z.infer<typeof DocumentRefSchema>;
