import { z } from 'zod';

const NoteTagListSchema = z
  .array(z.string().min(1).describe('Tag name to associate with the note'))
  .optional()
  .describe('Optional list of tag names for the note');

export const ListNotesSchema = z.object({
  order_by: z
    .string()
    .optional()
    .describe('Sort order for notes, e.g. "created_at:desc"'),
  project_id: z
    .number()
    .optional()
    .describe('Filter notes by numeric project ID'),
});

export const CreateNoteSchema = z.object({
  title: z.string().min(1).describe('Note title'),
  content: z.string().min(1).describe('Note content body'),
  color: z
    .string()
    .optional()
    .describe('Optional note color identifier or hex value'),
  project_uid: z
    .string()
    .min(1)
    .optional()
    .describe('Optional project UID to associate with the note'),
  tags: NoteTagListSchema,
});

export const UpdateNoteSchema = z.object({
  uid: z.string().min(1).describe('Unique identifier (UID) of the note'),
  title: z.string().min(1).optional().describe('Updated note title'),
  content: z.string().min(1).optional().describe('Updated note content body'),
  color: z
    .string()
    .optional()
    .describe('Updated note color identifier or hex value'),
  project_uid: z
    .string()
    .min(1)
    .optional()
    .describe('Updated project UID associated with the note'),
  tags: NoteTagListSchema,
});

export const DeleteNoteSchema = z.object({
  uid: z.string().min(1).describe('Unique identifier (UID) of the note to delete'),
});
