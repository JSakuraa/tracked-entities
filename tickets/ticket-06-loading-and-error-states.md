# TE-106: Loading and error states for the entity list

**Type:** Improvement
**Priority:** High
**Component:** Entity List, API client

## Description

When the page first loads, the entity list shows an empty table with "0 entities" for about a second before the data appears. Users have reported this as "the list is empty" and filed bugs about it.

When the API is down or returns an error, the page shows the same empty table forever with no indication that anything went wrong, and the browser console shows an unhandled error.

The user should always be able to tell whether the data is loading, has loaded, or failed to load.

To test the error case locally: start only the web app (`npm run dev:web`) without the API server, or stop the server while the page is open and reload.

## Acceptance Criteria

- [ ] While entities are being fetched, the user sees a loading indicator (e.g. "Loading entities…") instead of an empty table or "0 entities".
- [ ] The loading indicator can be read by assistive technology (screen readers announce it).
- [ ] If the request fails, the user sees a clear error message instead of the table.
- [ ] Server responses with a non-success HTTP status (4xx/5xx) count as failures. The client does not try to render them as data.
- [ ] The error state has a "Retry" button that fetches the data again. Retrying shows the loading indicator again.
- [ ] Once the data loads successfully, the list renders as it does today.
- [ ] No unhandled promise rejections appear in the browser console for any of these cases.
- [ ] No React warnings about updating state on an unmounted component.
