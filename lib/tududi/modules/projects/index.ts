import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import { registerProjectResources } from './resources';
import { registerProjectTools } from './tools';

export function register(server: McpServer, client: TududiClient): void {
  registerProjectTools(server, client);
  registerProjectResources(server, client);
}
