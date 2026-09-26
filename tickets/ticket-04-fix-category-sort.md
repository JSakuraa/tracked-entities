# TE-104: "Sort by category" produces wrong and inconsistent ordering

**Type:** Bug
**Priority:** High
**Component:** Entity List
**Reported by:** Operations (two separate reports, merged)

## Description

### Report 1

> When I check "Sort by category," the list isn't actually alphabetical. A couple of vehicles show up near the top, above most of the equipment, and then the rest of the vehicles show up at the bottom where I'd expect them. It looks like vehicles are split into two groups. I think personnel might be doing the same thing.

### Report 2

> After I turn "Sort by category" on and then off again, the list stays sorted. I expected it to go back to the original order. The only way to get the original order back is to refresh the page.

### Steps to reproduce

1. Run the app and open the entity list.
2. Note the order of the rows.
3. Check "Sort by category."
4. Look at where rows with the category `Vehicle` appear compared to `vehicle` and `equipment`.
5. Uncheck "Sort by category."
6. Compare the row order to what you noted in step 2.

### Expected

- Step 4: Categories are in alphabetical order. All vehicles appear together, regardless of how the category is capitalized in the source data.
- Step 6: The list returns to its original, unsorted order.

### Actual

- Step 4: Some vehicles appear near the top of the list, separate from the other vehicles.
- Step 6: The list stays in sorted order.

## Acceptance Criteria

- [ ] Sorting by category orders categories alphabetically, regardless of capitalization.
- [ ] Entities whose categories differ only in capitalization (for example `Vehicle` and `vehicle`) sort together as one category.
- [ ] Within a category, entities keep their original relative order.
- [ ] Turning "Sort by category" off returns the list to its original order without a page refresh.
- [ ] The category text displayed for each entity is unchanged. Do not change how the data looks, only how it is ordered.
- [ ] The root cause is fixed, not just the symptoms in the UI.
- [ ] All tests in `src/utils/sortByCategory.test.ts` pass.
