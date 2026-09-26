# Tracked Entities

A small full-stack TypeScript app for practicing "extend an existing codebase" interview exercises. It shows a list of tracked units (vehicles, personnel, and equipment) served by a small Express API.

The app works, but it is **intentionally incomplete**. Work items are in [`tickets/`](./tickets). Write your reflections in [`NOTES.md`](./NOTES.md).

**Start with [`STUDY_GUIDE.md`](./STUDY_GUIDE.md).** It covers the concepts the tickets use, without solving them.

## Stack

- **Frontend:** React + TypeScript, built with Vite
- **Backend:** Express (Node) serving an in-memory array. There is no database.
- **Tests:** Vitest + React Testing Library + jest-dom

## Getting started

Requires Node 20 or later.

```bash
npm install
```

### Run the app

```bash
npm run dev
```

This starts both processes:

- API on http://localhost:3001 (`GET /api/entities`)
- Web app on http://localhost:5173. Vite proxies `/api` requests to the API.

To run them separately, use `npm run dev:server` and `npm run dev:web`.

The API adds about 600ms of simulated latency to every response. The data resets whenever the server restarts, and `lastUpdated` timestamps are generated relative to server start time.

### Run tests

```bash
npm test
```

For watch mode:

```bash
npm run test:watch
```

To run a single file:

```bash
npx vitest run src/utils/sortByCategory.test.ts
```

> **Expect failures on a fresh checkout.** The suites for tickets 03 and 04 are already written and fail until you complete those tickets. That is intended: they check your work.

### Type-check

```bash
npm run typecheck
```

## Project layout

```
shared/
  types.ts                 Entity types shared by client and server
server/
  index.ts                 Express app entry
  data.ts                  In-memory seed data
  routes/entities.ts       GET /api/entities
src/
  api/entities.ts          Client for the entities API
  components/
    EntityList.tsx         Main list view
    StatusBadge.tsx
  utils/
    sortByCategory.ts      (+ .test.ts)
    formatRelativeTime.ts  (+ .test.ts), placeholder only
  test/setup.ts            Vitest/RTL setup
tickets/                   One markdown file per ticket
NOTES.md                   Your reflections, one section per ticket
```

## Tickets

| #  | Ticket                                                           | Type        |
| -- | ---------------------------------------------------------------- | ----------- |
| 01 | [Filter by status](./tickets/ticket-01-filter-by-status.md)                | Feature     |
| 02 | [Search with debounce](./tickets/ticket-02-search-with-debounce.md)        | Feature     |
| 03 | [Relative time display](./tickets/ticket-03-relative-time-display.md)      | Feature     |
| 04 | [Category sort bug](./tickets/ticket-04-fix-category-sort.md)              | Bug         |
| 05 | [Group by category](./tickets/ticket-05-group-by-category.md)              | Feature     |
| 06 | [Loading and error states](./tickets/ticket-06-loading-and-error-states.md) | Improvement |
| 07 | [EntityList tests](./tickets/ticket-07-entity-list-tests.md)               | Tech debt   |

You can do the tickets in any order. Doing 07 early gives you a safety net for the others.
