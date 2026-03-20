import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import { registerMetricsResources } from './resources';

export function register(server: McpServer, client: TududiClient): void {
  registerMetricsResources(server, client);
}
