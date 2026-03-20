import { z } from 'zod';

export const ListTasksSchema = z.object({
  type: z
    .enum(['today', 'upcoming', 'completed', 'archived', 'all'])
    .optional()
    .describe(
      'Filter tasks by type. "today" shows tasks planned for today, "upcoming" shows future tasks',
    ),
  status: z
    .enum(['pending', 'completed', 'archived'])
    .optional()
    .describe('Filter by task status'),
  project_id: z
    .number()
    .optional()
    .describe('Filter tasks by project ID'),
  group_by: z
    .enum(['day', 'project'])
    .optional()
    .describe('Group results by day or project'),
  order_by: z
    .string()
    .optional()
    .describe('Sort order, e.g. "created_at:desc"'),
});

export const GetTaskSchema = z.object({
  uid: z.string().min(1).describe('Unique identifier (UID) of the task'),
});

export const CreateTaskSchema = z.object({
  name: z.string().min(1).describe('Task name/title'),
  priority: z
    .enum(['low', 'medium', 'high'])
    .optional()
    .describe('Task priority level'),
  status: z
    .enum(['pending', 'completed', 'archived'])
    .optional()
    .describe('Task status'),
  due_date: z
    .string()
    .optional()
    .describe('Due date in ISO 8601 format'),
  project_id: z
    .number()
    .optional()
    .describe('ID of the project to assign the task to'),
  note: z.string().optional().describe('Additional notes for the task'),
  tags: z
    .array(
      z.object({
        name: z.string().describe('Tag name'),
      }),
    )
    .optional()
    .describe('Tags to associate'),
  subtasks: z
    .array(
      z.object({
        name: z.string().describe('Subtask name'),
        priority: z
          .enum(['low', 'medium', 'high'])
          .optional()
          .describe('Subtask priority level'),
        status: z
          .enum(['pending', 'completed', 'archived'])
          .optional()
          .describe('Subtask status'),
      }),
    )
    .optional()
    .describe('Subtasks to create along with the task'),
  recurrence_type: z
    .enum(['none', 'daily', 'weekly', 'monthly', 'yearly'])
    .optional()
    .describe('Recurrence pattern'),
  recurrence_interval: z
    .number()
    .optional()
    .describe('Interval between recurrences'),
  recurrence_end_date: z
    .string()
    .optional()
    .describe('End date for recurrence in ISO 8601 format'),
  today: z
    .boolean()
    .optional()
    .describe("Whether to add this task to today's plan"),
});

export const UpdateTaskSchema = z.object({
  uid: z.string().min(1).describe('UID of the task to update'),
  name: z.string().optional().describe('Updated task name'),
  note: z.string().optional().describe('Updated notes'),
  priority: z
    .enum(['low', 'medium', 'high'])
    .optional()
    .describe('Updated priority'),
  status: z
    .enum(['pending', 'completed', 'archived'])
    .optional()
    .describe('Updated status'),
  due_date: z
    .string()
    .optional()
    .describe('Updated due date in ISO 8601'),
  project_id: z.number().optional().describe('Updated project ID'),
  tags: z
    .array(
      z.object({
        name: z.string().describe('Tag name'),
      }),
    )
    .optional()
    .describe('Updated tags (replaces all)'),
  today: z
    .boolean()
    .optional()
    .describe("Whether to add/remove from today's plan"),
  recurrence_type: z
    .enum(['none', 'daily', 'weekly', 'monthly', 'yearly'])
    .optional()
    .describe('Updated recurrence'),
});

export const DeleteTaskSchema = z.object({
  uid: z.string().min(1).describe('UID of the task to delete'),
});

export const ToggleTaskCompletionSchema = z.object({
  id: z.number().describe('Numeric ID of the task to toggle completion'),
});

export const ListSubtasksSchema = z.object({
  uid: z.string().min(1).describe('UID of the parent task'),
});
