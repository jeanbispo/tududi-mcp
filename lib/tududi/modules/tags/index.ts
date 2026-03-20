import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import { registerTagResources } from './resources';
import { registerTagTools } from './tools';

export function register(server: McpServer, client: TududiClient): void {
  registerTagTools(server, client);
  registerTagResources(server, client);
}
