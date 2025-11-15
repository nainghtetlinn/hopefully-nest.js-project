import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email(),
  username: z.string().min(6, 'Username must be at least 6 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type RegisterDto = z.infer<typeof registerSchema>;
