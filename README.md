# Project Vault

Project Vault turns student work into a credible, searchable showcase. Students create a profile, upload or connect projects, and publish a portfolio; later phases add AI analysis, faculty review, and isolated Docker execution.

## Architecture

| Workspace | Responsibility |
| --- | --- |
| `frontend` | React/Vite user interface |
| `backend` | Express API, MongoDB Atlas data access, auth and Socket.IO |
| `sandbox-worker` | Isolated Docker execution jobs; deploy separately from the API |
| `docker/templates` | Maintained Dockerfiles for approved project stacks |
| `docs` | Product, API and security decisions |

## Storage boundaries

- **MongoDB Atlas:** users, profiles, projects, reviews, OTP records, metadata and execution summaries.
- **Object storage:** thumbnails, project images and ZIP files.
- **Sandbox host:** temporary repository workspaces and short-lived execution logs only.

## Development phases

1. Branding, landing page and authentication.
2. Dashboard, profile and project CRUD.
3. Search, public portfolios and ranked projects.
4. GitHub import, AI analysis and faculty workflow.
5. Sandboxed project execution.

Copy each workspace's `.env.example` to `.env` before running it. Do not commit secrets.
