import { z } from 'zod';

export const ListAreasSchema = z.object({});

export const CreateAreaSchema = z.object({
  name: z.string().min(1).describe('Area name'),
  description: z.string().optional().describe('Optional area description'),
});

export const UpdateAreaSchema = z.object({
  uid: z.string().min(1).describe('Unique identifier (UID) of the area'),
  name: z.string().min(1).optional().describe('Updated area name'),
  description: z.string().optional().describe('Updated area description'),
});

export const DeleteAreaSchema = z.object({
  uid: z.string().min(1).describe('Unique identifier (UID) of the area to delete'),
});
