import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(3, 'Minimum 3 characters for the username')
    .max(20, 'Maximum 20 characters for the username'),
  password: z
    .string()
    .min(8, 'Minimum password 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
});

export const updateProfileSchema = z
  .object({
    email: z.string().email('Invalid email address').optional(),
    username: z
      .string()
      .min(3, 'Minimum 3 characters for the username')
      .max(20, 'Maximum 20 characters for the username')
      .optional(),
    password: z
      .string()
      .min(8, 'Minimum password 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
      .optional()
  })
  .strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginSchema>;
