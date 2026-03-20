import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createClientFromAuthInfo } from '@/lib/tududi/client';
import type { Area } from '@/lib/tududi/types';
import {
  CreateAreaSchema,
  DeleteAreaSchema,
  ListAreasSchema,
  UpdateAreaSchema,
} from './schemas';

export function registerAreaTools(server: McpServer): void {
  server.registerTool(
    'list_areas',
    {
      title: 'List Areas',
      description: 'List all areas with their names and UIDs',
      inputSchema: ListAreasSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (_args, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const areas = await client.get<Area[]>('/api/areas');
      const summary = areas
        .map((area) => `- 📂 ${area.name} (uid: ${area.uid})`)
        .join('\n');

      return {
        content: [
          {
            type: 'text' as const,
            text: `Found ${areas.length} area(s):\n\n${summary || 'No areas found.'}`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'create_area',
    {
      title: 'Create Area',
      description: 'Create a new area with an optional description',
      inputSchema: CreateAreaSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (args, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const area = await client.post<Area>('/api/areas', args);

      return {
        content: [
          {
            type: 'text' as const,
            text: `✅ Area created: 📂 ${area.name} (uid: ${area.uid})`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'update_area',
    {
      title: 'Update Area',
      description:
        'Update an existing area by UID. Only provided fields will be changed.',
      inputSchema: UpdateAreaSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ uid, ...updates }, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const area = await client.patch<Area>(`/api/areas/${uid}`, updates);

      return {
        content: [
          {
            type: 'text' as const,
            text: `✅ Area updated: 📂 ${area.name} (uid: ${area.uid})`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'delete_area',
    {
      title: 'Delete Area',
      description:
        'Permanently delete an area by UID. This action cannot be undone.',
      inputSchema: DeleteAreaSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ uid }, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      await client.delete<void>(`/api/areas/${uid}`);

      return {
        content: [
          {
            type: 'text' as const,
            text: `🗑️ Area ${uid} deleted successfully.`,
          },
        ],
      };
    },
  );
}
