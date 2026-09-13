# Pusakawan Backoffice

The Pusakawan Backoffice is the administration interface for content in the Pusakawan app. It currently supports managing app-home content, games, game questions, and a user's profile. The interface is localized in English and Indonesian and applies navigation permissions based on the signed-in user's role.

## Technology

- React 19 and TypeScript
- [Refine](https://refine.dev/) for resources, routing, data access, and authentication integration
- Vite and Tailwind CSS 4
- shadcn/ui and Radix UI components
- React Hook Form and Zod validation
- MSW for browser-side API mocking during development
- i18next for English and Indonesian translations
- Jest for unit tests

## Prerequisites

- Node.js `>=24.14.0`
- npm `>=11.12.0`
- pnpm (recommended; the repository includes `pnpm-lock.yaml`)

## Get started

Install dependencies and start the development server:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

The `refine dev` command starts the Vite development server. Open the local URL printed in the terminal.

By default, the application uses MSW, so it runs without a backend. The mock service worker is loaded from `public/mockServiceWorker.js` and preserves mutations only for the current browser session.

### Mock accounts

All mock accounts use the password `password`.

| Email | Role | Available navigation |
| --- | --- | --- |
| `superadmin@test.com` | `SUPER_ADMIN` | All current resources |
| `admin@test.com` | `ADMIN` | App and LMS resources allowed to admins |
| `lms@test.com` | `LMS` | LMS resources |

For a persistent mocked session, select **Remember me** at sign-in. This simulates a refresh-token cookie.

## Environment configuration

Create a `.env` file in the repository root:

```dotenv
VITE_API_URL=https://api.pusakawan.id/v1
VITE_ENABLE_MSW=true
```

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | When MSW is disabled | Base URL for the backend API, without a trailing route segment. |
| `VITE_ENABLE_MSW` | Yes | Set to `true` to use browser mocks; set to `false` to call the backend. |

When `VITE_ENABLE_MSW=true`, API URLs are relative paths so MSW can intercept them. Restart the dev server after changing Vite environment variables.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local development server. |
| `pnpm build` | Type-check and produce a production build in `dist/`. |
| `pnpm start` | Serve the production build through Refine. |
| `pnpm test` | Run Jest tests. |
| `pnpm refine` | Run the Refine CLI. |

## Application areas

| Area | Routes | Current capabilities |
| --- | --- | --- |
| App Home | `/app/home`, `/app/home/new`, `/app/home/edit/:id` | List, search, filter, create, edit, publish/unpublish, and delete home content. |
| Games | `/app/games`, `/app/games/new`, `/app/games/edit/:id` | List, search, filter, create, edit, publish/unpublish, delete, and manage game details/questions. |
| Profile | `/edit-profile/me` | View and update the signed-in user's profile. |
| LMS / user management | Resource navigation exists | Pages outside the implemented areas show an under-development state. |

Access to resources is controlled in `src/providers/resources.tsx`. The current roles are `SUPER_ADMIN`, `ADMIN`, `LMS`, and `APP`.

## Project structure

```text
public/
  locales/                 Translation files (`en` and `id`)
  mockServiceWorker.js      MSW worker used in development
src/
  components/              Shared UI and Refine-specific components
  hooks/                   Reusable React hooks
  lib/                     URL constants and utilities
  mocks/                   MSW browser setup and API handlers
  pages/                   Route-level screens and forms
  providers/               Auth, REST data providers, resources, and request hooks
  types/                   Zod schemas and inferred domain types
  tests/                   Jest tests
  App.tsx                  Routes, Refine setup, permissions, and providers
  index.tsx                Application bootstrap and MSW initialization
```

Use the `@/` alias for imports from `src/`; it is configured in `vite.config.ts`.

## API integration

Endpoints and frontend routes are defined in `src/lib/urls.ts`. Data providers use `@refinedev/rest` with Ky request hooks. When connected to a backend, protected requests include an in-memory bearer token.

The implemented providers expect the following response shapes:

```json
// List endpoints
{ "data": [], "total": 0 }

// Single-item, create, update, and delete endpoints
{ "data": {} }
```

List requests send `page` and `size` query parameters. Equality filters are sent as query parameters, and sorters are passed through the `sort` parameter. The App Home provider supports CRUD at `/app/home`; the Games provider reads from `/app/games` and retrieves detailed game data from `/app/game-details/:id` unless a request supplies `meta.simple`.

Authentication uses these endpoints:

```text
POST /auth/admin/login
POST /auth/refresh
POST /auth/logout
```

The login response must contain a `data` object with an `accessToken`, `expiresIn`, `user`, and `profileCompleted`. A refresh response returns the token payload directly.

## Development notes

- Add or update translations in both `public/locales/en/common.json` and `public/locales/id/common.json`.
- Add new API mocks under `src/mocks/handlers/` and register them in `src/mocks/browser.ts`.
- Define resource metadata and allowed roles in `src/providers/resources.tsx` when adding a feature to the sidebar.
- Use the existing data-provider pattern to map Refine calls to backend endpoints and response envelopes.
- Validate form data with the Zod schemas in `src/types/`; the exported TypeScript types are inferred from those schemas.

## Docker

The included multi-stage `Dockerfile` builds the static site and serves the generated `dist/` directory with `serve`.

```bash
docker build -t pusakawan-backoffice .
docker run --rm -p 3000:3000 pusakawan-backoffice
```

The container uses the port selected by `serve` (typically `3000`). Pass any build-time Vite configuration through the Docker build environment as appropriate for the deployment environment.

## Testing and verification

Run the project checks before opening a pull request:

```bash
pnpm build
pnpm test
```

`pnpm build` is the primary type-check and production-build verification. Tests are stored under `src/tests/`.
