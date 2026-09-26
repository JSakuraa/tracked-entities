# TE-105: Group entity list by category

**Type:** Feature
**Priority:** Low
**Component:** Entity List

## Description

Operators tend to think about entities by category: all vehicles, all personnel, all equipment. Instead of one flat table, give users the option to view the list as sections grouped by category, each with a heading showing the category name.

## Acceptance Criteria

- [ ] The toolbar has a "Group by category" toggle. It is off by default, and when off the list looks the same as it does today.
- [ ] When the toggle is on, entities appear in separate sections, one per category.
- [ ] Each section has a header showing the category name and how many entities are in that section, e.g. "Vehicle (6)".
- [ ] Categories that differ only in capitalization (`Vehicle` and `vehicle`) appear in **one** section, not two.
- [ ] Category headers are shown in a consistent, capitalized form (e.g. "Equipment", "Personnel", "Vehicle"), whatever the casing in the source data.
- [ ] Sections are in alphabetical order by category.
- [ ] Within each section, entities keep the order they would have in the ungrouped list.
- [ ] Grouping works together with the status filter (TE-101) and search (TE-102). Sections with no matching entities are not shown.
- [ ] Each section still shows the same per-entity columns as the ungrouped table.
