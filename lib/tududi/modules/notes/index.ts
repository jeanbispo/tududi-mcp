import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerNoteResources } from './resources';
import { registerNoteTools } from './tools';

export function register(server: McpServer): void {
  registerNoteTools(server);
  registerNoteResources(server);
}
