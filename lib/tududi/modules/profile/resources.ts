import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createClientFromAuthInfo } from '@/lib/tududi/client';
import type { Profile } from '@/lib/tududi/types';

export function registerProfileResources(server: McpServer): void {
  server.registerResource(
    'profile_detail',
    'tududi://profile',
    {
      title: 'Profile Detail',
      description: 'Current Tududi profile details',
      mimeType: 'application/json',
    },
    async (uri, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const profile = await client.get<Profile>('/api/profile');

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(profile, null, 2),
          },
        ],
      };
    },
  );
}
