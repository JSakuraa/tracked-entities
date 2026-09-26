# TE-101: Filter entity list by status

**Type:** Feature
**Priority:** Medium
**Component:** Entity List

## Description

Operators monitoring the entity list want to focus on a subset of units, most often everything currently in `alert`. Right now the list shows every entity with no way to narrow it down.

Add a way for users to filter the entity list by status: `active`, `inactive`, or `alert`. When no status filter is selected, the list should show all entities, exactly as it does today.

## Acceptance Criteria

- [ ] The entity list has a visible, labeled control for choosing a status filter.
- [ ] The available options are: All, Active, Inactive, Alert.
- [ ] "All" is the default when the page loads, and the full list is shown.
- [ ] Choosing a status shows only entities with that status.
- [ ] Choosing "All" again shows every entity.
- [ ] The entity count shown in the toolbar reflects the number of entities currently displayed.
- [ ] If a filter matches no entities, the user sees a short "No entities match" message rather than an empty table.
- [ ] The "Sort by category" option continues to work with a filter applied.
- [ ] Changing the filter does not trigger another request to the API.
