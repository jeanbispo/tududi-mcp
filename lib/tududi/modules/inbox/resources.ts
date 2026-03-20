import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createClientFromAuthInfo } from '@/lib/tududi/client';
import type { InboxItem, InboxPaginatedResponse } from '@/lib/tududi/types';

type InboxResponse = InboxItem[] | InboxPaginatedResponse;

function normalizeInboxResponse(data: InboxResponse): {
  items: InboxItem[];
  pagination?: InboxPaginatedResponse['pagination'];
} {
  if (Array.isArray(data)) {
    return { items: data };
  }

  return data;
}

export function registerInboxResources(server: McpServer): void {
  server.registerResource(
    'inbox_list',
    'tududi://inbox',
    {
      title: 'Inbox Items',
      description: 'Inbox capture items from Tududi',
      mimeType: 'application/json',
    },
    async (uri, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const data = await client.get<InboxResponse>('/api/inbox');
      const inbox = normalizeInboxResponse(data);

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(inbox, null, 2),
          },
        ],
      };
    },
  );
}
