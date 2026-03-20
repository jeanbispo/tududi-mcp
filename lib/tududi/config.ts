export interface TududiConfig {
  apiUrl: string;
  apiToken: string;
  enabledModules: ModuleName[];
}

export const ALL_MODULES = [
  'tasks',
  'projects',
  'notes',
  'areas',
  'inbox',
  'tags',
  'profile',
  'metrics',
] as const;

export type ModuleName = (typeof ALL_MODULES)[number];

export function isModuleEnabled(
  config: TududiConfig,
  module: ModuleName,
): boolean {
  return config.enabledModules.includes(module);
}
