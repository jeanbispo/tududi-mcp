import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createClientFromAuthInfo } from '@/lib/tududi/client';
import type { TasksMetrics } from '@/lib/tududi/types';

export function registerMetricsResources(server: McpServer): void {
  server.registerResource(
    'metrics_dashboard',
    'tududi://metrics',
    {
      title: 'Task Metrics Dashboard',
      description: 'Dashboard metrics and task lists from Tududi',
      mimeType: 'application/json',
    },
    async (uri, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const metrics = await client.get<TasksMetrics>('/api/tasks/metrics');

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(metrics, null, 2),
          },
        ],
      };
    },
  );
}
