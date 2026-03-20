import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import { registerNoteResources } from './resources';
import { registerNoteTools } from './tools';

export function register(server: McpServer, client: TududiClient): void {
  registerNoteTools(server, client);
  registerNoteResources(server, client);
}
