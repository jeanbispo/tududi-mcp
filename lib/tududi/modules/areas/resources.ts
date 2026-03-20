import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createClientFromAuthInfo } from '@/lib/tududi/client';
import type { Area } from '@/lib/tududi/types';

export function registerAreaResources(server: McpServer): void {
  server.registerResource(
    'areas_list',
    'tududi://areas',
    {
      title: 'All Areas',
      description: 'List of all areas from Tududi',
      mimeType: 'application/json',
    },
    async (uri, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
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
