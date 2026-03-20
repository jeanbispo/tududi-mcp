# Tududi MCP Server

A whitelabel [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server that connects LLM-powered clients to [Tududi](https://github.com/chrisvel/tududi) — an open-source productivity and GTD (Getting Things Done) application created by [Chris Vel](https://github.com/chrisvel).

Tududi helps users organise tasks, projects, notes, and areas following GTD methodology. This MCP server acts as a bridge, allowing AI assistants (Claude, Cursor, VS Code Copilot, etc.) to read and manipulate Tududi data through a standardised protocol.

> **Prerequisite:** You need a running Tududi instance (self-hosted) with API access enabled. The MCP server connects to Tududi's REST API and does not include the Tududi application itself.

## How it works

The server exposes a single MCP endpoint at [`app/mcp/route.ts`](app/mcp/route.ts) built on Next.js Route Handlers. On each request, it:

1. **Authenticates** — validates the bearer token against the Tududi instance's `/api/profile` endpoint.
2. **Registers modules** — lazily loads all 8 domain modules (tasks, projects, notes, areas, inbox, tags, profile, metrics) and registers their tools and resources with the MCP server.
3. **Serves tools & resources** — the connected MCP client discovers and invokes them as needed.

Authentication is handled via [`mcp-handler`](https://www.npmjs.com/package/mcp-handler)'s `withMcpAuth` wrapper with token verification against the Tududi API.

## Features

### Tasks

- **Tools (7):** `list_tasks`, `get_task`, `create_task`, `update_task`, `delete_task`, `toggle_task_completion`, `list_subtasks`
- **Resources (2):** `tududi://tasks`, `tududi://tasks/{uid}`

### Projects

- **Tools (4):** `list_projects`, `create_project`, `update_project`, `delete_project`
- **Resources (2):** `tududi://projects`, `tududi://projects/{uid}`

### Notes

- **Tools (4):** `list_notes`, `create_note`, `update_note`, `delete_note`
- **Resources (1):** `tududi://notes`

### Areas

- **Tools (4):** `list_areas`, `create_area`, `update_area`, `delete_area`
- **Resources (1):** `tududi://areas`

### Inbox

- **Tools (2):** `list_inbox`, `create_inbox_item`
- **Resources (1):** `tududi://inbox`

### Tags

- **Tools (2):** `list_tags`, `create_tag`
- **Resources (1):** `tududi://tags`

### Profile

- **Tools (2):** `get_profile`, `update_profile`
- **Resources (1):** `tududi://profile`

### Metrics

- **Tools (0)**
- **Resources (1):** `tududi://metrics`

**Total:** **25 tools** and **10 resources**

## Prerequisites

- **A running Tududi instance** — self-host the [original Tududi project](https://github.com/chrisvel/tududi) and obtain an API token.
- **Node.js 18+** or **Bun** runtime.

## Whitelabel configuration

The server authenticates per-request using HTTP headers sent by the MCP client. The `tududi-api-url` header identifies the Tududi instance and the `Authorization` header carries the bearer token.

### Client-side headers

| Header | Required | Description |
| --- | --- | --- |
| `tududi-api-url` | Yes | Base URL of the Tududi instance (e.g. `https://my-tududi.com`) |
| `Authorization` | Yes | Bearer token for the Tududi API (`Bearer <token>`) |
| `tududi-enabled-modules` | No | Comma-separated list of modules to enable; defaults to `all` |

### MCP client configuration example

```json
{
  "mcp": {
    "servers": {
      "tududi": {
        "type": "http",
        "url": "https://my-tududi-mcp.vercel.app/mcp",
        "headers": {
          "tududi-api-url": "https://my-tududi.com",
          "Authorization": "Bearer my-api-token",
          "tududi-enabled-modules": "tasks,projects,notes"
        }
      }
    }
  }
}
```

### Available modules

`tasks` · `projects` · `notes` · `areas` · `inbox` · `tags` · `profile` · `metrics`

## Setup & running

```bash
# Install dependencies
bun install

# Development
bun dev

# Build
bun build

# Production
bun start
```

After starting the server, the MCP endpoint is available at `http://localhost:3000/mcp`.

## Tech stack

- **Next.js 16** (Route Handlers)
- **TypeScript** (strict mode)
- **MCP SDK** (`@modelcontextprotocol/sdk`)
- **mcp-handler** (Next.js MCP adapter with auth support)
- **Zod 4** (schema validation)

## Project structure

```text
├── app/mcp/route.ts          # MCP endpoint — auth + handler setup
├── lib/tududi/
│   ├── client.ts             # HTTP client for the Tududi REST API
│   ├── config.ts             # Module names and config types
│   ├── types.ts              # Shared TypeScript types
│   └── modules/
│       ├── index.ts          # Module registry (lazy-loaded)
│       ├── tasks/            # 7 tools, 2 resources
│       ├── projects/         # 4 tools, 2 resources
│       ├── notes/            # 4 tools, 1 resource
│       ├── areas/            # 4 tools, 1 resource
│       ├── inbox/            # 2 tools, 1 resource
│       ├── tags/             # 2 tools, 1 resource
│       ├── profile/          # 2 tools, 1 resource
│       └── metrics/          # 1 resource
└── scripts/                  # Test clients
```

## Using with MCP clients

1. Deploy this server (e.g. Vercel) or run it locally.
2. Point your MCP client to the endpoint `https://your-host/mcp`.
3. Set the `tududi-api-url` and `Authorization` headers as shown above.
4. The client will auto-discover all registered tools and resources.

## License

MIT
