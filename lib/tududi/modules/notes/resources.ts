import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createClientFromAuthInfo } from '@/lib/tududi/client';
import type { Note } from '@/lib/tududi/types';

export function registerNoteResources(server: McpServer): void {
  server.registerResource(
    'notes_list',
    'tududi://notes',
    {
      title: 'All Notes',
      description: 'List of all notes from Tududi',
      mimeType: 'application/json',
    },
    async (uri, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const notes = await client.get<Note[]>('/api/notes');

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(notes, null, 2),
          },
        ],
      };
    },
  );
}
