import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ModuleName, TududiConfig } from '@/lib/tududi/config';
import { isModuleEnabled } from '@/lib/tududi/config';

export type ModuleRegistrar = (server: McpServer) => void;

const moduleRegistry = new Map<
  ModuleName,
  () => Promise<{ register: ModuleRegistrar }>
>();

moduleRegistry.set('tasks', () => import('./tasks'));
moduleRegistry.set('projects', () => import('./projects'));
moduleRegistry.set('notes', () => import('./notes'));
moduleRegistry.set('areas', () => import('./areas'));
moduleRegistry.set('inbox', () => import('./inbox'));
moduleRegistry.set('tags', () => import('./tags'));
moduleRegistry.set('profile', () => import('./profile'));
moduleRegistry.set('metrics', () => import('./metrics'));

async function registerModules(
  server: McpServer,
  shouldRegister: (moduleName: ModuleName) => boolean,
): Promise<ModuleName[]> {
  const registered: ModuleName[] = [];

  for (const [name, loader] of moduleRegistry) {
    if (!shouldRegister(name)) {
      continue;
    }

    const moduleDefinition = await loader();
    moduleDefinition.register(server);
    registered.push(name);
  }

  return registered;
}

export async function registerAllModules(
  server: McpServer,
): Promise<ModuleName[]> {
  return registerModules(server, () => true);
}

export async function registerEnabledModules(
  server: McpServer,
  config: TududiConfig,
): Promise<ModuleName[]> {
  return registerModules(server, (name) => isModuleEnabled(config, name));
}
