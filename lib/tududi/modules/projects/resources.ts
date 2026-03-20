import {
  ResourceTemplate,
  type McpServer,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { createClientFromAuthInfo } from '@/lib/tududi/client';
import type { Project } from '@/lib/tududi/types';

interface ProjectsListResponse {
  projects: Project[] | Record<string, Project[]>;
}

function normalizeProjects(
  projects: Project[] | Record<string, Project[]>,
): Project[] {
  if (Array.isArray(projects)) {
    return projects;
  }

  return Object.values(projects).flat();
}

export function registerProjectResources(server: McpServer): void {
  server.registerResource(
    'projects_list',
    'tududi://projects',
    {
      title: 'All Projects',
      description: 'List of all projects from Tududi',
      mimeType: 'application/json',
    },
    async (uri, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const data = await client.get<ProjectsListResponse>('/api/projects');

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    },
  );

  const projectTemplate = new ResourceTemplate('tududi://projects/{uid}', {
    list: async (extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const data = await client.get<ProjectsListResponse>('/api/projects');
      const projects = normalizeProjects(data.projects);

      return {
        resources: projects.map((project) => ({
          name: project.name,
          uri: `tududi://projects/${project.uid}`,
        })),
      };
    },
  });

  server.registerResource(
    'project_detail',
    projectTemplate,
    {
      title: 'Project Detail',
      description: 'Detailed information about a specific project',
      mimeType: 'application/json',
    },
    async (uri, params, extra) => {
      const client = createClientFromAuthInfo(extra.authInfo);
      const uid = params.uid as string;
      const project = await client.get<Project>(`/api/project/${uid}`);

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(project, null, 2),
          },
        ],
      };
    },
  );
}
