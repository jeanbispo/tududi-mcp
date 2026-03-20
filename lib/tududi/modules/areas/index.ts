import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import { registerAreaResources } from './resources';
import { registerAreaTools } from './tools';

export function register(server: McpServer, client: TududiClient): void {
  registerAreaTools(server, client);
  registerAreaResources(server, client);
}
