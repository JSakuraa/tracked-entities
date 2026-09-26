# TE-107: Add test coverage for EntityList

**Type:** Tech Debt
**Priority:** Medium
**Component:** Entity List

## Description

`src/components/EntityList.tsx` is the main screen of the app and has no automated tests. Several upcoming changes (filtering, search, grouping, loading states) will touch this component, and we want a safety net before and during that work.

Write a test file for `EntityList` covering its current behavior. The project already has Vitest, React Testing Library, `@testing-library/user-event`, and `jest-dom` matchers set up. See `src/test/setup.ts`.

The tests must not depend on the real API server running.

## Acceptance Criteria

- [ ] A new test file exists at `src/components/EntityList.test.tsx`.
- [ ] Tests run with `npm test` and pass without the dev server or API running.
- [ ] The tests do not make real network requests.
- [ ] Coverage includes, at minimum:
  - [ ] Entities returned by the API are rendered, with each entity's name, status, and category visible.
  - [ ] The entity count in the toolbar matches the number of rendered entities.
  - [ ] Checking "Sort by category" reorders the rows by category.
  - [ ] Unchecking "Sort by category" restores the original order. (This test is expected to fail until TE-104 is fixed. That's fine, and it's a good way to prove the bug.)
  - [ ] The component behaves sensibly when the API returns an empty list.
- [ ] Tests query the DOM the way a user would (by role, label, or visible text) rather than by CSS class names or implementation details.
- [ ] Tests are independent. Each one passes when run alone, and order does not matter.
- [ ] As later tickets (TE-101, 102, 105, 106) change this component, add tests for their behavior to this file.
