import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { TududiClient } from '@/lib/tududi/client';
import type { Project } from '@/lib/tududi/types';
import {
  CreateProjectSchema,
  DeleteProjectSchema,
  ListProjectsSchema,
  UpdateProjectSchema,
} from './schemas';

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

function formatProjectTaskStatus(project: Project): string {
  return `total ${project.task_status.total}, done ${project.task_status.done}, in progress ${project.task_status.in_progress}, not started ${project.task_status.not_started}`;
}

export function registerProjectTools(
  server: McpServer,
  client: TududiClient,
): void {
  server.registerTool(
    'list_projects',
    {
      title: 'List Projects',
      description:
        'List projects with optional filters by status and area, including completion and task progress details',
      inputSchema: ListProjectsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ status, area_id }) => {
      const params: Record<string, string> = {};

      if (status) {
        params.status = status;
      }

      if (area_id) {
        params.area_id = String(area_id);
      }

      const data = await client.get<ProjectsListResponse>(
        '/api/projects',
        params,
      );
      const projects = normalizeProjects(data.projects);

      const summary = projects
        .map(
          (project) =>
            `- ${project.name} (uid: ${project.uid})\n  Status: ${project.status}\n  Completion: ${project.completion_percentage}%\n  Task status: ${formatProjectTaskStatus(project)}`,
        )
        .join('\n');

      return {
        content: [
          {
            type: 'text' as const,
            text: `Found ${projects.length} project(s):\n\n${summary || 'No projects found.'}`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'create_project',
    {
      title: 'Create Project',
      description:
        'Create a new project with optional description, priority, status, area, due date, image, and tags',
      inputSchema: CreateProjectSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (args) => {
      const project = await client.post<Project>('/api/project', args);

      return {
        content: [
          {
            type: 'text' as const,
            text: `✅ Project created: "${project.name}" (uid: ${project.uid})`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'update_project',
    {
      title: 'Update Project',
      description:
        'Update an existing project by UID. Only the provided fields will be changed.',
      inputSchema: UpdateProjectSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ uid, ...updates }) => {
      const project = await client.patch<Project>(
        `/api/project/${uid}`,
        updates,
      );

      return {
        content: [
          {
            type: 'text' as const,
            text: `✅ Project updated: "${project.name}" (uid: ${project.uid})`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'delete_project',
    {
      title: 'Delete Project',
      description:
        'Permanently delete a project by UID. This action cannot be undone.',
      inputSchema: DeleteProjectSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ uid }) => {
      await client.delete<{ message: 'Project successfully deleted' }>(
        `/api/project/${uid}`,
      );

      return {
        content: [
          {
            type: 'text' as const,
            text: `🗑️ Project ${uid} deleted successfully.`,
          },
        ],
      };
    },
  );
}
