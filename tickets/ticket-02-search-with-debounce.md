# TE-102: Search entities by name

**Type:** Feature
**Priority:** Medium
**Component:** Entity List

## Description

As the number of tracked entities grows, scrolling to find a specific unit is slow. Users want to type part of a name and see the list narrow to matching entities.

The list should not update on every single keystroke. Fast typists see the table flicker and reflow as they type, and we expect this list to become large enough that re-filtering on each keystroke will be noticeable. Results should update once the user pauses typing.

## Acceptance Criteria

- [ ] A text input labeled "Search" appears in the entity list toolbar.
- [ ] Typing in the input filters the list to entities whose **name** contains the search text.
- [ ] Matching is case-insensitive ("truck" matches "Patrol Truck 12").
- [ ] Leading and trailing whitespace in the search text is ignored.
- [ ] The list updates roughly 300ms after the user stops typing, not on every keystroke. The input itself still shows every character immediately as it is typed.
- [ ] Clearing the input shows the full list again.
- [ ] Search works together with the status filter from TE-101. Both conditions apply at once.
- [ ] If nothing matches, the user sees the same "No entities match" message as TE-101.
- [ ] Nothing throws or warns in the console if the component unmounts while a search is pending.
