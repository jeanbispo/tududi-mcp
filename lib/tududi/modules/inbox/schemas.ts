import { z } from 'zod';

export const ListInboxSchema = z.object({
  limit: z.number().int().positive().optional().describe('Maximum number of inbox items to return'),
  offset: z.number().int().min(0).optional().describe('Number of inbox items to skip'),
});

export const CreateInboxItemSchema = z.object({
  content: z.string().min(1).describe('Inbox item content to capture'),
  source: z
    .string()
    .optional()
    .describe('Optional source label for the inbox item. Defaults to "mcp"'),
});
