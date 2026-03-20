import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import { registerTaskResources } from './resources';
import { registerTaskTools } from './tools';

export function register(server: McpServer, client: TududiClient): void {
  registerTaskTools(server, client);
  registerTaskResources(server, client);
}
