import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTagResources } from './resources';
import { registerTagTools } from './tools';

export function register(server: McpServer): void {
  registerTagTools(server);
  registerTagResources(server);
}
