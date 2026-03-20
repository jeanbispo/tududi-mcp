import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAreaResources } from './resources';
import { registerAreaTools } from './tools';

export function register(server: McpServer): void {
  registerAreaTools(server);
  registerAreaResources(server);
}
