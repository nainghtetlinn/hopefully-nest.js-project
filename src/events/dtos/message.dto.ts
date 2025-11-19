import { z } from 'zod';

export const messageSchema = z.object({
  to: z.number().gte(0),
  message: z.string().min(5, 'Message must have at least 5 characters'),
});

export type MessageDto = z.infer<typeof messageSchema>;
