import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { createMcpHandler, withMcpAuth } from 'mcp-handler';

import { TududiClient } from '@/lib/tududi/client';
import { registerAllModules } from '@/lib/tududi/modules';

export const dynamic = 'force-dynamic';

const handler = createMcpHandler(
  async (server) => {
    console.log('[tududi-mcp] Initializing server and registering modules...');
    const client = new TududiClient();
    const registered = await registerAllModules(server, client);
    console.log(`[tududi-mcp] Registered modules: ${registered.join(', ')}`);
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  },
  {
    basePath: '',
    verboseLogs: true,
    maxDuration: 60,
    disableSse: true,
  },
);

const verifyToken = async (
  req: Request,
  bearerToken?: string,
): Promise<AuthInfo | undefined> => {
  const apiUrl = req.headers.get('tududi-api-url')?.trim();
  const apiToken = bearerToken?.trim();
  const enabledModules = req.headers.get('tududi-enabled-modules')?.trim();

  if (!apiUrl || !apiToken) {
    console.warn('[tududi-mcp] Auth failed: missing api url or token');
    return undefined;
  }

  console.log(
    `[tududi-mcp] Config — url=${apiUrl} token=*** modules=${enabledModules ?? 'all'}`,
  );

  try {
    const authorization = /^Bearer\s+/i.test(apiToken)
      ? apiToken
      : `Bearer ${apiToken}`;

    const profileRes = await fetch(`${apiUrl.replace(/\/$/, '')}/api/profile`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
        Accept: 'application/json',
      },
    });

    if (!profileRes.ok) {
      console.warn(
        `[tududi-mcp] Token validation failed: ${profileRes.status} ${profileRes.statusText}`,
      );
      return undefined;
    }

    const profile = (await profileRes.json()) as {
      uid?: string;
      email?: string;
    };
    console.log(
      `[tududi-mcp] Token valid — user=${profile.email ?? profile.uid ?? 'unknown'}`,
    );

    return {
      token: apiToken,
      clientId: profile.uid ?? 'unknown',
      scopes: [],
      extra: {
        email: profile.email,
        apiUrl,
        enabledModules: enabledModules ?? 'all',
      },
    };
  } catch (error) {
    console.error('[tududi-mcp] Token validation error:', error);
    return undefined;
  }
};

const authHandler = withMcpAuth(handler, verifyToken, {
  required: true,
});

export { authHandler as GET, authHandler as POST, authHandler as DELETE };
