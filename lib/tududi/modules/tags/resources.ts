import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import type { Tag } from '@/lib/tududi/types';

export function registerTagResources(
  server: McpServer,
  client: TududiClient,
): void {
  server.registerResource(
    'tags_list',
    'tududi://tags',
    {
      title: 'All Tags',
      description: 'List of all tags from Tududi',
      mimeType: 'application/json',
    },
    async (uri) => {
      const tags = await client.get<Tag[]>('/api/tags');

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(tags, null, 2),
          },
        ],
      };
    },
  );
}
