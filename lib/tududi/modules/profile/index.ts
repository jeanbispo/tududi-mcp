import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import { registerProfileResources } from './resources';
import { registerProfileTools } from './tools';

export function register(server: McpServer, client: TududiClient): void {
  registerProfileTools(server, client);
  registerProfileResources(server, client);
}
