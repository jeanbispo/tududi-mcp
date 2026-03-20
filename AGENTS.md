# AGENTS.md

## Project overview

This is **tududi-mcp** — a whitelabel MCP (Model Context Protocol) server that bridges LLM clients to [Tududi](https://github.com/chrisvel/tududi), an open-source GTD/productivity app created by [Chris Vel](https://github.com/chrisvel).

The server does **not** include the Tududi application. A running, self-hosted Tududi instance with API access is required.

## This is NOT the Next.js you know

APIs, conventions, and file structure may differ from training data. Read relevant guide in `node_modules/next/dist/docs/` before writing code.

## Architecture

The MCP endpoint lives at [`app/mcp/route.ts`](app/mcp/route.ts). It uses `mcp-handler` with `withMcpAuth` for per-request bearer token authentication against the Tududi `/api/profile` endpoint. On initialisation the server lazily loads 8 domain modules from [`lib/tududi/modules/`](lib/tududi/modules/) and registers **25 tools** and **10 resources**.

### Key files

| File | Purpose |
| --- | --- |
| [`app/mcp/route.ts`](app/mcp/route.ts) | MCP entry point — creates handler, verifies token, exports route |
| [`lib/tududi/client.ts`](lib/tududi/client.ts) | HTTP client wrapping Tududi REST API (GET/POST/PATCH/DELETE) |
| [`lib/tududi/config.ts`](lib/tududi/config.ts) | Module names, config types, `isModuleEnabled` helper |
| [`lib/tududi/types.ts`](lib/tududi/types.ts) | Shared TypeScript types |
| [`lib/tududi/modules/index.ts`](lib/tududi/modules/index.ts) | Lazy module registry — loads and registers tools/resources |

### Authentication flow

1. MCP client sends `tududi-api-url` header + `Authorization: Bearer <token>`.
2. [`app/mcp/route.ts`](app/mcp/route.ts) `verifyToken` function calls `GET /api/profile` on the Tududi instance.
3. On success, returns `AuthInfo` with the user's UID, email, API URL, and enabled modules.
4. On failure, returns `undefined` → request is rejected.

### Modules

Each module under `lib/tududi/modules/<name>/` exports a `register(server, client)` function that registers its tools and resources with the MCP server.

| Module | Tools | Resources |
| --- | --- | --- |
| `tasks` | 7 | 2 |
| `projects` | 4 | 2 |
| `notes` | 4 | 1 |
| `areas` | 4 | 1 |
| `inbox` | 2 | 1 |
| `tags` | 2 | 1 |
| `profile` | 2 | 1 |
| `metrics` | 0 | 1 |

### Tech stack

Next.js 16 · TypeScript (strict) · MCP SDK (`@modelcontextprotocol/sdk`) · `mcp-handler` · Zod 4

## Coding guidelines

- All code is TypeScript with strict mode enabled.
- Modules follow a consistent pattern: `schemas.ts` → `tools.ts` → `resources.ts` → `index.ts`.
- The HTTP client in [`lib/tududi/client.ts`](lib/tududi/client.ts) is stateless; auth credentials come from the per-request MCP context.
- Zod schemas validate all tool inputs.
- No environment variables are required at build time; all configuration is passed via HTTP headers at runtime.
