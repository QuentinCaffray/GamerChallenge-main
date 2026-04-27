import { z } from 'zod';

export const participationIdParamSchema = z.object({
  id: z.string().min(1, 'ID is required')
});

export const challengeIdParamSchema = z.object({
  id: z.string().min(1, 'Challenge ID is  required')
});

export const createParticipationBodySchema = z.object({
  submissionUrl: z
    .string()
    .trim()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  description: z.string().max(500, 'Description too long').optional()
});

export const updateParticipationBodySchema = z.object({
  submissionUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((v) => !v || /^https?:\/\/.+/i.test(v), {
      message: 'Must be a valid URL'
    }),
  description: z.string().max(500, 'Description too long').optional()
});
