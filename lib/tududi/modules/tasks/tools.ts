import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import type { Task, TasksListResponse } from '@/lib/tududi/types';
import {
  CreateTaskSchema,
  DeleteTaskSchema,
  GetTaskSchema,
  ListSubtasksSchema,
  ListTasksSchema,
  ToggleTaskCompletionSchema,
  UpdateTaskSchema,
} from './schemas';

export function registerTaskTools(
  server: McpServer,
  client: TududiClient,
): void {
  server.registerTool(
    'list_tasks',
    {
      title: 'List Tasks',
      description:
        'List tasks with optional filters by type (today, upcoming, completed, archived, all), status, project, and grouping',
      inputSchema: ListTasksSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ type, status, project_id, group_by, order_by }) => {
      const params: Record<string, string> = {};

      if (type) {
        params.type = type;
      }

      if (status) {
        params.status = status;
      }

      if (project_id) {
        params.project_id = String(project_id);
      }

      if (group_by) {
        params.groupBy = group_by;
      }

      if (order_by) {
        params.order_by = order_by;
      }

      const data = await client.get<TasksListResponse>('/api/tasks', params);
      const tasks = data.tasks || [];

      const summary = tasks
        .map(
          (task) =>
            `- [${task.completed_at ? '✅' : '⬜'}] ${task.name} (uid: ${task.uid})${task.due_date ? ` 📅 ${task.due_date}` : ''}${task.Project ? ` 📁 ${task.Project.name}` : ''}`,
        )
        .join('\n');

      return {
        content: [
          {
            type: 'text' as const,
            text: `Found ${tasks.length} task(s):\n\n${summary || 'No tasks found.'}`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'get_task',
    {
      title: 'Get Task',
      description: 'Get detailed information about a specific task by its UID',
      inputSchema: GetTaskSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ uid }) => {
      const task = await client.get<Task>(`/api/task/${uid}`);

      const subtasksList = task.subtasks?.length
        ? `\n\nSubtasks:\n${task.subtasks
            .map(
              (subtask) =>
                `  - [${subtask.completed_at ? '✅' : '⬜'}] ${subtask.name} (uid: ${subtask.uid})`,
            )
            .join('\n')}`
        : '';
      const tagsList = task.tags?.length
        ? `\nTags: ${task.tags.map((tag) => tag.name).join(', ')}`
        : '';

      return {
        content: [
          {
            type: 'text' as const,
            text: `Task: ${task.name}\nUID: ${task.uid}\nStatus: ${task.completed_at ? 'completed' : 'pending'}\nDue: ${task.due_date || 'none'}${task.Project ? `\nProject: ${task.Project.name}` : ''}${tagsList}${subtasksList}`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'create_task',
    {
      title: 'Create Task',
      description:
        'Create a new task with optional priority, due date, project assignment, tags, subtasks, and recurrence settings',
      inputSchema: CreateTaskSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (args) => {
      const task = await client.post<Task>('/api/task', args);

      return {
        content: [
          {
            type: 'text' as const,
            text: `✅ Task created: "${task.name}" (uid: ${task.uid})${task.due_date ? ` 📅 Due: ${task.due_date}` : ''}`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'update_task',
    {
      title: 'Update Task',
      description:
        'Update an existing task by UID. Only provided fields will be changed.',
      inputSchema: UpdateTaskSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ uid, ...updates }) => {
      const task = await client.patch<Task>(`/api/task/${uid}`, updates);

      return {
        content: [
          {
            type: 'text' as const,
            text: `✅ Task updated: "${task.name}" (uid: ${task.uid})`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'delete_task',
    {
      title: 'Delete Task',
      description:
        'Permanently delete a task by UID. This action cannot be undone.',
      inputSchema: DeleteTaskSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ uid }) => {
      await client.delete<{ message: 'Task successfully deleted' }>(
        `/api/task/${uid}`,
      );

      return {
        content: [
          {
            type: 'text' as const,
            text: `🗑️ Task ${uid} deleted successfully.`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'toggle_task_completion',
    {
      title: 'Toggle Task Completion',
      description:
        'Toggle the completion status of a task (mark as completed or reopen). Uses numeric task ID.',
      inputSchema: ToggleTaskCompletionSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ id }) => {
      const task = await client.patch<Task>(
        `/api/task/${id}/toggle_completion`,
        {},
      );

      return {
        content: [
          {
            type: 'text' as const,
            text: `${task.completed_at ? '✅ Task completed' : '🔄 Task reopened'}: "${task.name}"`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'list_subtasks',
    {
      title: 'List Subtasks',
      description: 'List all subtasks of a parent task by its UID',
      inputSchema: ListSubtasksSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ uid }) => {
      const subtasks = await client.get<Task[]>(`/api/task/${uid}/subtasks`);

      const summary = subtasks
        .map(
          (subtask) =>
            `- [${subtask.completed_at ? '✅' : '⬜'}] ${subtask.name} (uid: ${subtask.uid})`,
        )
        .join('\n');

      return {
        content: [
          {
            type: 'text' as const,
            text: subtasks.length
              ? `Subtasks of ${uid}:\n\n${summary}`
              : `No subtasks found for task ${uid}.`,
          },
        ],
      };
    },
  );
}
