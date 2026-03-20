import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerProjectResources } from './resources';
import { registerProjectTools } from './tools';

export function register(server: McpServer): void {
  registerProjectTools(server);
  registerProjectResources(server);
}
