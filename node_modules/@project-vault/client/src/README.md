# Frontend structure

The current `main.jsx` owns the landing page. Keep future pages and reusable functionality separated as follows:

- `pages/`: route-level screens: auth, dashboard, profile, projects, search and showcase.
- `layouts/`: navbar, sidebar and authenticated application shell.
- `components/`: reusable cards, fields, modals, buttons and project tiles.
- `features/`: page-specific UI/state grouped by product domain.
- `lib/`: API client, formatters and constants.
- `hooks/`: shared React hooks.
- `assets/`: final Project Vault logo, image assets and fonts.
