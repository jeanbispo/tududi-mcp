import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerInboxResources } from './resources';
import { registerInboxTools } from './tools';

export function register(server: McpServer): void {
  registerInboxTools(server);
  registerInboxResources(server);
}
