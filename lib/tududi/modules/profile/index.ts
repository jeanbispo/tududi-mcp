import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerProfileResources } from './resources';
import { registerProfileTools } from './tools';

export function register(server: McpServer): void {
  registerProfileTools(server);
  registerProfileResources(server);
}
