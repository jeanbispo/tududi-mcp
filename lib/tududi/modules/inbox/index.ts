import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import { registerInboxResources } from './resources';
import { registerInboxTools } from './tools';

export function register(server: McpServer, client: TududiClient): void {
  registerInboxTools(server, client);
  registerInboxResources(server, client);
}
