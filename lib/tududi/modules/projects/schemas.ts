import { z } from 'zod';

const ProjectStatusSchema = z
  .enum([
    'not_started',
    'planned',
    'in_progress',
    'waiting',
    'done',
    'cancelled',
  ])
  .describe('Project lifecycle status');

const ProjectPrioritySchema = z
  .enum(['low', 'medium', 'high'])
  .describe('Project priority level');

export const ListProjectsSchema = z.object({
  status: z
    .enum([
      'not_started',
      'planned',
      'in_progress',
      'waiting',
      'done',
      'cancelled',
      'all',
      'not_completed',
    ])
    .optional()
    .describe('Filter projects by status or include all / non-completed projects'),
  area_id: z
    .number()
    .optional()
    .describe('Filter projects by numeric area ID'),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(1).describe('Project name'),
  description: z
    .string()
    .optional()
    .describe('Optional project description'),
  priority: ProjectPrioritySchema.optional().describe('Optional project priority'),
  status: ProjectStatusSchema.optional().describe('Optional initial project status'),
  area_id: z
    .number()
    .optional()
    .describe('Optional numeric area ID to associate with the project'),
  due_date_at: z
    .string()
    .optional()
    .describe('Optional project due date in ISO 8601 format'),
  image_url: z
    .string()
    .optional()
    .describe('Optional project image URL'),
  tags: z
    .array(z.string().describe('Project tag name'))
    .optional()
    .describe('Optional list of tag names to associate with the project'),
});

export const UpdateProjectSchema = z.object({
  uid: z.string().min(1).describe('UID of the project to update'),
  name: z.string().optional().describe('Updated project name'),
  description: z
    .string()
    .optional()
    .describe('Updated project description'),
  priority: ProjectPrioritySchema.optional().describe('Updated project priority'),
  status: ProjectStatusSchema.optional().describe('Updated project status'),
  area_id: z
    .number()
    .optional()
    .describe('Updated numeric area ID'),
  due_date_at: z
    .string()
    .optional()
    .describe('Updated project due date in ISO 8601 format'),
  image_url: z
    .string()
    .optional()
    .describe('Updated project image URL'),
  pin_to_sidebar: z
    .boolean()
    .optional()
    .describe('Whether the project should be pinned to the sidebar'),
  tags: z
    .array(z.string().describe('Project tag name'))
    .optional()
    .describe('Updated list of tag names for the project'),
});

export const DeleteProjectSchema = z.object({
  uid: z.string().min(1).describe('UID of the project to delete'),
});
