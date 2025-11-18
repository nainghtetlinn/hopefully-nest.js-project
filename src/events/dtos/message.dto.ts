import { z } from 'zod';

export const messageSchema = z.object({
  clientId: z.string().min(1, 'Client ID required'),
  message: z.string().min(5, 'Message must have at least 5 characters'),
});

export type MessageDto = z.infer<typeof messageSchema>;
