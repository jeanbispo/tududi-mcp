import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerMetricsResources } from './resources';

export function register(server: McpServer): void {
  registerMetricsResources(server);
}
