import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTaskResources } from './resources';
import { registerTaskTools } from './tools';

export function register(server: McpServer): void {
  registerTaskTools(server);
  registerTaskResources(server);
}
