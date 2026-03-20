import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import type { Note } from '@/lib/tududi/types';
import {
  CreateNoteSchema,
  DeleteNoteSchema,
  ListNotesSchema,
  UpdateNoteSchema,
} from './schemas';

function formatNoteTitle(note: Note): string {
  return note.title || 'Untitled note';
}

export function registerNoteTools(
  server: McpServer,
  client: TududiClient,
): void {
  server.registerTool(
    'list_notes',
    {
      title: 'List Notes',
      description:
        'List notes with optional sorting and project filtering, including note UIDs for follow-up actions',
      inputSchema: ListNotesSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ order_by, project_id }) => {
      const params: Record<string, string> = {};

      if (order_by) {
        params.order_by = order_by;
      }

      if (project_id) {
        params.project_id = String(project_id);
      }

      const notes = await client.get<Note[]>('/api/notes', params);
      const summary = notes
        .map(
          (note) =>
            `- 📝 ${formatNoteTitle(note)} (uid: ${note.uid})${note.Project ? ` 📁 ${note.Project.name}` : ''}`,
        )
        .join('\n');

      return {
        content: [
          {
            type: 'text' as const,
            text: `Found ${notes.length} note(s):\n\n${summary || 'No notes found.'}`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'create_note',
    {
      title: 'Create Note',
      description:
        'Create a new note with content, optional color, project association, and tags',
      inputSchema: CreateNoteSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (args) => {
      const note = await client.post<Note>('/api/note', args);

      return {
        content: [
          {
            type: 'text' as const,
            text: `✅ Note created: 📝 ${formatNoteTitle(note)} (uid: ${note.uid})`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'update_note',
    {
      title: 'Update Note',
      description:
        'Update an existing note by UID. Only the provided fields will be changed.',
      inputSchema: UpdateNoteSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ uid, ...updates }) => {
      const note = await client.patch<Note>(`/api/note/${uid}`, updates);

      return {
        content: [
          {
            type: 'text' as const,
            text: `✅ Note updated: 📝 ${formatNoteTitle(note)} (uid: ${note.uid})`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'delete_note',
    {
      title: 'Delete Note',
      description:
        'Permanently delete a note by UID. This action cannot be undone.',
      inputSchema: DeleteNoteSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ uid }) => {
      await client.delete<{ message: string }>(`/api/note/${uid}`);

      return {
        content: [
          {
            type: 'text' as const,
            text: `🗑️ Note ${uid} deleted successfully.`,
          },
        ],
      };
    },
  );
}
