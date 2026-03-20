import { z } from 'zod';

export const GetProfileSchema = z.object({});

export const UpdateProfileSchema = z.object({
  name: z.string().optional().describe('Updated first name'),
  surname: z.string().optional().describe('Updated surname'),
  appearance: z.string().optional().describe('Updated appearance theme preference'),
  language: z.string().optional().describe('Updated language preference'),
  timezone: z.string().optional().describe('Updated timezone identifier'),
  first_day_of_week: z
    .number()
    .int()
    .min(0)
    .max(6)
    .optional()
    .describe('Updated first day of week where 0-6 follows backend convention'),
  avatar_image: z.string().optional().describe('Updated avatar image URL'),
  telegram_bot_token: z
    .string()
    .optional()
    .describe('Updated Telegram bot token for integrations'),
  task_intelligence_enabled: z
    .boolean()
    .optional()
    .describe('Enable or disable task intelligence features'),
  task_summary_enabled: z
    .boolean()
    .optional()
    .describe('Enable or disable task summary notifications'),
  pomodoro_enabled: z
    .boolean()
    .optional()
    .describe('Enable or disable pomodoro features'),
});
