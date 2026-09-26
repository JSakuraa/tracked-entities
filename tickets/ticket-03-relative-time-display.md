# TE-103: Show "last updated" as relative time

**Type:** Feature
**Priority:** Medium
**Component:** Entity List, Utilities

## Description

Every entity has a `lastUpdated` ISO timestamp, but the list doesn't show it anywhere. Operators need to see at a glance how stale each entity's data is. Raw timestamps are hard to scan, so the value should be shown as human-friendly relative text such as "3 minutes ago" or "yesterday".

Implement `formatRelativeTime(isoString: string): string` in `src/utils/formatRelativeTime.ts`. A placeholder already exists there. Then use it to display a "Last Updated" column in the entity list.

### Formatting rules

`elapsed` is the current time minus the timestamp. Units are always **rounded down**, so 1 minute 59 seconds is "1 minute ago".

| Elapsed time                          | Output                                 |
| ------------------------------------- | -------------------------------------- |
| Less than 5 seconds, or in the future | `just now`                             |
| 5 seconds up to 1 minute              | `N seconds ago`                        |
| 1 minute up to 1 hour                 | `1 minute ago` / `N minutes ago`       |
| 1 hour up to 24 hours                 | `1 hour ago` / `N hours ago`           |
| 24 hours up to 48 hours               | `yesterday`                            |
| 2 days up to 7 days                   | `N days ago`                           |
| 7 days up to 30 days                  | `1 week ago` / `N weeks ago`           |
| 30 days up to 365 days                | `1 month ago` / `N months ago` (a month counts as 30 days) |
| 365 days or more                      | `1 year ago` / `N years ago` (a year counts as 365 days)  |

- Each lower bound is inclusive and each upper bound is exclusive. For example, exactly 60 seconds is `1 minute ago`, and 59.999 seconds is `59 seconds ago`.
- "Yesterday" is based on elapsed time (24–48 hours), not calendar days.
- If the input can't be parsed as a date, return `unknown`. Do not throw.

## Acceptance Criteria

- [ ] `formatRelativeTime` follows every rule in the table above, including the singular and plural forms and the boundaries.
- [ ] Invalid or empty input returns `unknown` and does not throw.
- [ ] The entity list has a "Last Updated" column showing the relative time for each entity.
- [ ] Hovering over the relative time shows the full timestamp, so users can still get the exact value.
- [ ] **Test coverage required:** this function must be covered by unit tests. A suite already exists at `src/utils/formatRelativeTime.test.ts`. All of those tests must pass. Add your own cases if you find gaps.
- [ ] `npm run typecheck` passes.
