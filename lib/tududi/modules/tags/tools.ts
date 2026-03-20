import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createClientFromAuthInfo } from '@/lib/tududi/client';
import type { Tag } from '@/lib/tududi/types';
import { CreateTagSchema, ListTagsSchema } from './schemas';

export function registerTagTools(server: McpServer): void {
  server.registerTool(
    'list_tags',
    {
      title: 'List Tags',
      description: 'List all tags with their names and UIDs',
      inputSchema: ListTagsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (_args, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const tags = await client.get<Tag[]>('/api/tags');
      const summary = tags
        .map((tag) => `- 🏷️ ${tag.name} (uid: ${tag.uid})`)
        .join('\n');

      return {
        content: [
          {
            type: 'text' as const,
            text: `Found ${tags.length} tag(s):\n\n${summary || 'No tags found.'}`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'create_tag',
    {
      title: 'Create Tag',
      description: 'Create a new tag',
      inputSchema: CreateTagSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (args, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const tag = await client.post<Tag>('/api/tag', args);

      return {
        content: [
          {
            type: 'text' as const,
            text: `✅ Tag created: 🏷️ ${tag.name} (uid: ${tag.uid})`,
          },
        ],
      };
    },
  );
}
