import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createClientFromAuthInfo } from '@/lib/tududi/client';
import type { Profile } from '@/lib/tududi/types';
import { GetProfileSchema, UpdateProfileSchema } from './schemas';

function formatProfileName(profile: Profile): string {
  const name = [profile.name, profile.surname].filter(Boolean).join(' ').trim();
  return name || 'Not set';
}

function maskToken(token: string | null): string {
  if (!token) {
    return 'not configured';
  }

  if (token.length <= 6) {
    return '••••••';
  }

  return `${token.slice(0, 4)}••••${token.slice(-2)}`;
}

function formatProfileSummary(profile: Profile): string {
  return [
    `👤 Name: ${formatProfileName(profile)}`,
    `📧 Email: ${profile.email}`,
    `🌍 Timezone: ${profile.timezone}`,
    `🗣️ Language: ${profile.language}`,
    `🎨 Appearance: ${profile.appearance}`,
    `📅 First day of week: ${profile.first_day_of_week}`,
    `🤖 Telegram bot token: ${maskToken(profile.telegram_bot_token)}`,
    `🧠 Task intelligence: ${profile.task_intelligence_enabled ? 'enabled' : 'disabled'}`,
    `📝 Task summary: ${profile.task_summary_enabled ? 'enabled' : 'disabled'}`,
    `🍅 Pomodoro: ${profile.pomodoro_enabled ? 'enabled' : 'disabled'}`,
    `🆔 UID: ${profile.uid}`,
  ].join('\n');
}

export function registerProfileTools(server: McpServer): void {
  server.registerTool(
    'get_profile',
    {
      title: 'Get Profile',
      description: 'Get the current Tududi profile and preferences',
      inputSchema: GetProfileSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (_args, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const profile = await client.get<Profile>('/api/profile');

      return {
        content: [
          {
            type: 'text' as const,
            text: formatProfileSummary(profile),
          },
        ],
      };
    },
  );

  server.registerTool(
    'update_profile',
    {
      title: 'Update Profile',
      description:
        'Update Tududi profile preferences. Only the provided fields will be changed.',
      inputSchema: UpdateProfileSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (updates, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const profile = await client.patch<Profile>('/api/profile', updates);

      return {
        content: [
          {
            type: 'text' as const,
            text: `✅ Profile updated.\n\n${formatProfileSummary(profile)}`,
          },
        ],
      };
    },
  );
}
