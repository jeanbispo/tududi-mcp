import {
  ResourceTemplate,
  type McpServer,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { createClientFromAuthInfo } from '@/lib/tududi/client';
import type { Task, TasksListResponse } from '@/lib/tududi/types';

export function registerTaskResources(server: McpServer): void {
  server.registerResource(
    'tasks_list',
    'tududi://tasks',
    {
      title: 'All Tasks',
      description: 'List of all tasks from Tududi',
      mimeType: 'application/json',
    },
    async (uri, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const data = await client.get<TasksListResponse>('/api/tasks');

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    },
  );

  const taskTemplate = new ResourceTemplate('tududi://tasks/{uid}', {
    list: async (extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const data = await client.get<TasksListResponse>('/api/tasks');

      return {
        resources: data.tasks.map((task) => ({
          name: task.name,
          uri: `tududi://tasks/${task.uid}`,
        })),
      };
    },
  });

  server.registerResource(
    'task_detail',
    taskTemplate,
    {
      title: 'Task Detail',
      description: 'Detailed information about a specific task',
      mimeType: 'application/json',
    },
    async (uri, params, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const uid = params.uid as string;
      const task = await client.get<Task>(`/api/task/${uid}`);

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(task, null, 2),
          },
        ],
      };
    },
  );
}
