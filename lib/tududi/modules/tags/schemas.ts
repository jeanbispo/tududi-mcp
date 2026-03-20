import { z } from 'zod';

export const ListTagsSchema = z.object({});

export const CreateTagSchema = z.object({
  name: z.string().min(1).describe('Tag name'),
});
