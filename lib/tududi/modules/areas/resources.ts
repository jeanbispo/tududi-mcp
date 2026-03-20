import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import type { Area } from '@/lib/tududi/types';

export function registerAreaResources(
  server: McpServer,
  client: TududiClient,
): void {
  server.registerResource(
    'areas_list',
    'tududi://areas',
    {
      title: 'All Areas',
      description: 'List of all areas from Tududi',
      mimeType: 'application/json',
    },
    async (uri) => {
      const areas = await client.get<Area[]>('/api/areas');

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(areas, null, 2),
          },
        ],
      };
    },
  );
}
