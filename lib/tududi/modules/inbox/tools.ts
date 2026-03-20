import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import type { InboxItem, InboxPaginatedResponse } from '@/lib/tududi/types';
import { CreateInboxItemSchema, ListInboxSchema } from './schemas';

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

export function registerInboxTools(
  server: McpServer,
  client: TududiClient,
): void {
  server.registerTool(
    'list_inbox',
    {
      title: 'List Inbox Items',
      description:
        'List inbox capture items with optional pagination and status details',
      inputSchema: ListInboxSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ limit, offset }) => {
      const params: Record<string, string> = {};

      if (limit) {
        params.limit = String(limit);
      }

      if (offset !== undefined) {
        params.offset = String(offset);
      }

      const data = await client.get<InboxResponse>('/api/inbox', params);
      const inbox = normalizeInboxResponse(data);
      const summary = inbox.items
        .map(
          (item) =>
            `- 📥 ${item.content} (uid: ${item.uid}, status: ${item.status})`,
        )
        .join('\n');

      return {
        content: [
          {
            type: 'text' as const,
            text: `Found ${inbox.items.length} inbox item(s):\n\n${summary || 'No inbox items found.'}`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'create_inbox_item',
    {
      title: 'Create Inbox Item',
      description: 'Capture a new inbox item in Tududi',
      inputSchema: CreateInboxItemSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ content, source }) => {
      const item = await client.post<InboxItem>('/api/inbox', {
        content,
        source: source || 'mcp',
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: `✅ Inbox item created: 📥 ${item.content} (uid: ${item.uid}, status: ${item.status})`,
          },
        ],
      };
    },
  );
}
