# EventForge: Frontend (Phase 1)

Multi-tenant, white-label event website platform. **Phase 1 = frontend only.** All data lives in the
browser's `localStorage` (mock backend), so you can run and click through everything without a server.

## Run locally (VS Code)

```bash
npm install
npm run dev
```
Open http://localhost:3000 . Requires Node.js 18.18 or newer.

## Demo accounts

| Who | URL | Email | Password |
|---|---|---|---|
| Platform owner (Super Admin) | /super-admin/login | admin@platform.dev | super123 |
| Org admin: NDSS 2026 (published) | /login | admin@ndss.demo | demo1234 |
| Org admin: Green Campus Fest (published) | /login | green@demo.dev | demo1234 |
| Org admin: Tech Innovators Club (draft) | /login | club@demo.dev | demo1234 |

Public sites: `/o/ndss-2026`, `/o/green-campus-fest`. Draft preview: add `?preview=1` (only that org's admin or the super admin can open it).

## What is in Phase 1

- **Platform home**, organization **sign-up** (creates a full base website with sample content) and **login**
- **Organization admin panel** `/dashboard`: Overview, Branding (logo, name, colors, fonts, corners, light/dark, live preview),
  Website sections (show/hide/reorder/add/delete, schema-driven forms + image upload + live preview for every section),
  Events (create/duplicate/edit/delete), Registrations (verify/reject/search/CSV), Publish & Export
- **Published site** at `/o/<slug>` with event detail pages and a team registration form
- **Super Admin panel** `/super-admin`: platform KPIs, organizations (plan, suspend/activate, delete), activity log
- Export (static / full system) shows a disabled **Coming Soon** button only. Nothing is faked.

## Project map

```
src/lib/types.ts     data model            src/lib/seed.ts     NDSS content + base template
src/lib/schemas.ts   form definitions for every section/event field
src/lib/store.ts     localStorage "database" + hooks
src/lib/api.ts       ALL writes go through here (swap for real API calls in phase 2)
src/components/site  public site: navbar, footer, section renderers, event page, register form
src/components/form  schema-driven form engine + image upload
src/app/dashboard    organization admin panel      src/app/super-admin   platform admin panel
src/app/o/[slug]     published organization site
```

## Replacing the mock backend later

Every component calls functions in `src/lib/api.ts` and reads through `useDB()` in `src/lib/store.ts`.
When the real backend exists, re-implement those functions as HTTP calls; the UI stays the same.

## Known limits of the mock backend (by design)

- `localStorage` is about 5 MB. Uploaded images are compressed automatically; if storage fills up you will see a clear message. "Reset demo data" (Super Admin overview) restores the seed.
- Data is per browser. Passwords are stored in plain text and route guards are client-side only: **this is NOT security**. Real authentication, tenant isolation and authorization must be enforced by the backend (see proposal Section 9).
- Placeholder images are generated SVGs; upload your own from the dashboard.

## Planned for the next phases

Judging (magic-link judges, rubrics, blind scoring), leaderboards, coupons, QR check-in and volunteer scanner,
seat assignment, certificates, broadcast email, analytics, team matching and submission check.
