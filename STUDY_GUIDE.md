# Study Guide

Read this before starting the tickets. It covers the concepts and patterns the tickets exercise, without solving them.

**How to use this guide:**

- Examples use made-up domains (products, users, messages), not this repo's code. Translating a pattern to the codebase is part of the practice.
- Each section ends with **self-check questions**. If you can answer them out loud, you're ready for the matching ticket.
- One section is hidden in a `<details>` block because it would give away the ticket 4 bug. Open it after you've tried to find the bug yourself, or when you're stuck.

---

## Contents

1. [How to approach an "extend the codebase" exercise](#1-how-to-approach-an-extend-the-codebase-exercise)
2. [Tour of this repo](#2-tour-of-this-repo)
3. [React state: stored vs. derived](#3-react-state-stored-vs-derived)
4. [Controlled inputs and filter UIs](#4-controlled-inputs-and-filter-uis) (Tickets 01, 02)
5. [Debouncing](#5-debouncing) (Ticket 02)
6. [Dates and time math](#6-dates-and-time-math) (Ticket 03)
7. [Immutability and array methods](#7-immutability-and-array-methods) (Tickets 04, 05)
8. [Debugging methodology](#8-debugging-methodology) (Ticket 04)
9. [Transforming data: grouping](#9-transforming-data-grouping) (Ticket 05)
10. [Data fetching: loading, error, and cleanup](#10-data-fetching-loading-error-and-cleanup) (Ticket 06)
11. [Accessibility basics for dynamic UI](#11-accessibility-basics-for-dynamic-ui) (Tickets 01, 02, 06)
12. [Testing with Vitest and React Testing Library](#12-testing-with-vitest-and-react-testing-library) (Tickets 03, 04, 07)
13. [Suggested order and time boxes](#13-suggested-order-and-time-boxes)

---

## 1. How to approach an "extend the codebase" exercise

Interviewers watching these exercises care less about the final code than about **how you get there**. They want to see that you can work in someone else's code the way a teammate would.

### Before writing code

1. **Read the ticket twice.** Turn each acceptance criterion into something you can check. Note anything ambiguous.
2. **Ask clarifying questions.** In an interview, say them out loud: "Should the filter persist across reloads?" In practice, write your assumption down in `NOTES.md` and move on.
3. **Trace the data flow.** Find where the data comes from, where it's stored, how it's transformed, and where it's rendered. You're adding a step to that pipeline, so you need to know where the step goes.
4. **Match existing conventions.** Look at how existing files name things, structure components, import types, and write CSS classes. New code should look like it was written by the same team.

### While writing code

- **Make it work, then make it right.** Get the smallest version of the feature on screen first, then handle edge cases.
- **Narrate your reasoning.** "I'm putting this in a util so it's testable without React."
- **Keep the app running.** Check the browser after each small change rather than writing 100 lines and hoping.
- **Commit per ticket.** Small, reviewable diffs are a signal of good habits.

### Before calling it done

- Walk through every acceptance criterion and actually verify it.
- Run `npm test` and `npm run typecheck`.
- Look at the browser console for warnings and errors.

**Self-check**
- What are the first three things you'd do after reading a ticket, before touching code?
- How do you decide whether new logic belongs in a component or a separate util?

---

## 2. Tour of this repo

Read these files in this order before starting. It takes about 10 minutes.

| Order | File | What to look for |
| ----- | ---- | ---------------- |
| 1 | `shared/types.ts` | The `Entity` shape. Note which fields are unions and which are free-form strings. |
| 2 | `server/data.ts` | The seed data. Scan the `category` values carefully. |
| 3 | `server/routes/entities.ts` | The response shape, and the simulated latency. |
| 4 | `src/api/entities.ts` | How the client calls the API. What happens on a non-200 response? |
| 5 | `src/components/EntityList.tsx` | Where data is fetched, what's stored in state, and what's computed during render. |
| 6 | `src/utils/sortByCategory.ts` | Read it slowly. Does it do exactly what its doc comment promises? |
| 7 | `src/test/setup.ts`, `vite.config.ts` | How tests are configured. |
| 8 | The two `*.test.ts` files | They're a spec. Reading tests is a fast way to learn expected behavior. |

### The data flow

```
server/data.ts  ──►  GET /api/entities  ──►  fetchEntities()  ──►  useState in EntityList
                                                                         │
                                                        (transform during render)
                                                                         │
                                                                         ▼
                                                                    <table> rows
```

Most tickets add a step in the "transform during render" part of this pipeline, or add a new state that controls it.

**Self-check**
- What does `fetchEntities` return if the server responds with a 500?
- Which values in `EntityList` are *state*, and which are *computed from state*?
- How many distinct `category` strings exist in the seed data? How many distinct categories would a human say there are?

---

## 3. React state: stored vs. derived

The most important React habit for these tickets is keeping **the minimum state** and **computing everything else during render**.

### Stored state

Stored state is something the user or the network provides, which you can't compute from anything else:

- The raw list from the API
- What the user typed in a search box
- Which filter option is selected
- Whether a toggle is on

### Derived values

Derived values can be computed from stored state:

- The filtered list
- The count of visible items
- Items grouped into sections

```tsx
// ❌ Storing derived data: two sources of truth that can drift apart
const [products, setProducts] = useState<Product[]>([]);
const [inStockProducts, setInStockProducts] = useState<Product[]>([]);

useEffect(() => {
  setInStockProducts(products.filter((p) => p.inStock));
}, [products]);

// ✅ Derive it during render
const [products, setProducts] = useState<Product[]>([]);
const [onlyInStock, setOnlyInStock] = useState(false);

const visibleProducts = onlyInStock ? products.filter((p) => p.inStock) : products;
```

**Why this matters:** derived values can never be stale, there's no extra re-render, and there's less code to test.

### When derivation is expensive: `useMemo`

For a list of 18 items, just recompute every render. `useMemo` is a performance tool, not a correctness tool. Mention it in an interview if the list could get large, but don't reach for it by default.

```tsx
const visibleProducts = useMemo(
  () => products.filter((p) => p.inStock),
  [products],
);
```

### Chaining transforms

When several transforms apply (filter, then search, then sort, then group), write them as a readable pipeline. Each step takes a list and returns a new list:

```tsx
let visible = products;
if (category !== 'all') visible = visible.filter((p) => p.category === category);
if (query) visible = visible.filter((p) => p.name.toLowerCase().includes(query));
if (sorted) visible = sortByPrice(visible);
```

Order matters for performance (filter before sorting, so there's less to sort), but it should never matter for correctness. If it does, something upstream is mutating data.

**Self-check**
- A teammate adds `const [count, setCount] = useState(0)` and updates it in an effect whenever the list changes. What would you suggest in code review, and why?
- When is `useMemo` worth adding?

---

## 4. Controlled inputs and filter UIs

A **controlled input** gets its value from React state and reports changes through `onChange`. React state is the single source of truth.

```tsx
type Role = 'all' | 'admin' | 'editor' | 'viewer';

const [role, setRole] = useState<Role>('all');

<label>
  Role
  <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
    <option value="all">All</option>
    <option value="admin">Admin</option>
    <option value="editor">Editor</option>
    <option value="viewer">Viewer</option>
  </select>
</label>
```

### Design choices to think about (and say out loud)

- **`<select>` vs. radio buttons vs. toggle buttons.** Radios or buttons show every option at once and take one click. A select saves space. Any of these is fine; pick one and justify it.
- **Representing "no filter".** A sentinel value like `'all'`, or `null`? A union type like `'all' | Status` keeps TypeScript helping you.
- **Typing `e.target.value`.** It's always `string`. A cast is common. A type guard is stricter:

  ```ts
  const ROLES = ['admin', 'editor', 'viewer'] as const;
  type Role = (typeof ROLES)[number];
  const isRole = (v: string): v is Role => (ROLES as readonly string[]).includes(v);
  ```

- **Deriving options from a list.** Building options from a constant array keeps the UI and the type in sync:

  ```tsx
  {ROLES.map((r) => <option key={r} value={r}>{capitalize(r)}</option>)}
  ```

### Empty results

When filtering produces zero results, show a message instead of an empty table. The user needs to know the filter worked and nothing matched, rather than wondering whether something broke.

**Self-check**
- What's the difference between a controlled and an uncontrolled input? Which does this repo's existing checkbox use?
- Why might you *not* want to refetch from the API when a filter changes?

---

## 5. Debouncing

**Debouncing** waits until an event has *stopped* firing for N milliseconds, then acts once. For a search box, the user types "tru" and the list updates only after they pause.

It's related to, but different from, **throttling**, which acts *at most once* per N milliseconds while events keep firing.

| Technique | Events at 0, 50, 100, 150ms, then a pause (N = 300ms) | Good for |
| --------- | ------------------------------------------------------ | -------- |
| Debounce | Fires once, at 450ms | Search input, autosave, window resize end |
| Throttle | Fires at 0ms, then at most every 300ms | Scroll position, drag, rate-limited APIs |

### The core mechanism (plain JS)

```ts
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
```

Every call cancels the previous pending timer and starts a new one. Only the last call "survives" long enough to run.

### Debouncing in React

The plain-JS version has a trap in React: if you call `debounce(...)` inside a component body, you create a **new** debounced function on every render, each with its own timer, so nothing gets debounced.

The idiomatic React approach is to **debounce a value, not a function**:

- Keep the raw input value in state. The input stays responsive and shows every keystroke.
- Keep a second, *delayed* copy of that value that only updates after the user pauses.
- Filter using the delayed copy.

This pattern is often packaged as a small custom hook (`useDebouncedValue(value, delay)`). It's built from `useState`, `useEffect`, `setTimeout`, and an **effect cleanup function**.

### Effect cleanup is the key concept

```tsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // runs before the next effect run AND on unmount
}, [tick]);
```

The cleanup runs:
1. Before the effect runs again because a dependency changed.
2. When the component unmounts.

Think about how (1) naturally produces debounce behavior, and how (2) satisfies ticket 02's requirement about unmounting while a search is pending.

### Custom hooks

A custom hook is a function whose name starts with `use` and which calls other hooks. It's the React way to reuse stateful logic. A good hook is small, generic, and independently testable.

**Self-check**
- Why does calling a plain `debounce()` inside a component body not work?
- In the "debounce a value" approach, which value does the `<input>` display, and which value does the filter use?
- What happens to a pending timeout if the component unmounts and you *didn't* write a cleanup?

---

## 6. Dates and time math

### Parsing

```ts
Date.parse('2026-03-15T12:00:00Z');       // 1773576000000 (ms since epoch, UTC)
Date.parse('2026-03-15T07:00:00-05:00');  // same instant, different notation
Date.parse('garbage');                    // NaN
new Date('garbage').getTime();            // NaN
```

- ISO 8601 strings with `Z` or an offset like `-05:00` describe an **exact instant**. Timezones only matter for *display*.
- Invalid input doesn't throw. It produces `NaN`. Detect it with `Number.isNaN(x)`.
- `NaN` spreads through math silently: `NaN - 5` is `NaN`, and `NaN < 100` is `false`. An unchecked `NaN` falls through every `<` comparison in an if/else chain.

### Elapsed time

Work in **milliseconds** and define named constants:

```ts
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const elapsed = Date.now() - Date.parse(timestamp);
```

### Rounding

| Function | 1.9 | -1.9 | Use when |
| -------- | --- | ---- | -------- |
| `Math.floor` | 1 | -2 | You want "whole units completed" |
| `Math.round` | 2 | -2 | You want "nearest" |
| `Math.trunc` | 1 | -1 | You want to drop the decimal part toward zero |

Read the ticket's rules to decide which one you need.

### Boundary thinking

When a spec says "5 seconds up to 1 minute", ask yourself:
- Is 5 seconds exactly included? (Inclusive lower bound: `>=`)
- Is 60 seconds exactly included? (Exclusive upper bound: `<`)
- What about 59.999 seconds?

A **threshold table** checked in order (smallest first) is easy to read and easy to get right. Each branch only needs to check its upper bound, because the earlier branches already handled everything smaller.

### Pluralization

`1 minute` vs. `2 minutes`. A tiny helper keeps this from being copied into every branch. Watch out for `0` ("0 minutes"), although a well-designed threshold table may make it impossible to reach.

### "Now" in tests

A function that calls `Date.now()` returns different results each run. Two ways to make it testable:
1. Accept `now` as a parameter (dependency injection).
2. Keep the signature and have tests control the clock with **fake timers** (see [section 12](#fake-timers)).

This repo's tests use approach 2, so your function should read the current time *when it's called*, not when the module loads.

### `Intl.RelativeTimeFormat`

Browsers have a built-in API for this:

```ts
new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-1, 'day'); // "yesterday"
```

It's worth mentioning in an interview. Understand how its output differs from the ticket's spec (e.g. "just now", and the week/month cutoffs) before deciding whether to use it. Specs win over libraries.

**Self-check**
- What does `Date.parse('2026-13-45')` return, and how does your code detect it?
- If `elapsed` is exactly `60 * SECOND`, which branch of your threshold table should match?
- Why must you not compute `Date.now()` at the top of the module?

---

## 7. Immutability and array methods

### Why React cares

React decides whether to re-render by comparing **references**: `oldState === newState`. If you change an array or object *in place* and then set it back into state, React may see the same reference and skip the update. Worse, anything else holding that reference sees the change silently.

```ts
const original = [3, 1, 2];
const alias = original;
alias.push(4);
console.log(original); // [3, 1, 2, 4]  ← same array
```

This rule applies to **any** value that lives in React state or props, including arrays you received and didn't create yourself. Treat data you didn't create as read-only.

### Copying patterns

```ts
const copy = [...items];                              // shallow copy of array
const withNew = [...items, newItem];                  // add
const without = items.filter((i) => i.id !== id);     // remove
const updated = items.map((i) => (i.id === id ? { ...i, done: true } : i)); // update one
```

**Shallow vs. deep:** `[...items]` makes a new array, but the objects inside are the same objects. That's fine as long as you don't mutate those objects either.

### Functions that promise not to mutate

If a util's doc comment says it "returns" something, a caller will reasonably assume the input is untouched. Check that promise against what the code actually does. The test in this repo that uses `Object.freeze` is one way to verify it.

<details>
<summary><strong>Spoiler reference: which array methods mutate?</strong> (Open after attempting ticket 4, or if stuck.)</summary>

| Mutates the original | Returns a new array instead |
| -------------------- | --------------------------- |
| `push`, `pop`, `shift`, `unshift` | `concat`, spread `[...a, x]` |
| `splice` | `toSpliced` (ES2023), `slice` + spread |
| `sort` | `toSorted` (ES2023), or `[...a].sort()` |
| `reverse` | `toReversed` (ES2023), or `[...a].reverse()` |
| `fill`, `copyWithin` | `with(index, value)` (ES2023) |

Also watch out: `sort` returns **the same array it sorted**. That makes `const sorted = arr.sort(...)` look like it produced a new array when it didn't.

`toSorted` and related methods need `"lib": ["ES2023"]` or later in `tsconfig.json`. This repo targets ES2022, so the spread-then-sort pattern works without config changes. Changing the lib setting is also a valid choice you could justify.

</details>

### String comparison

```ts
'apple' < 'banana';  // true
'Banana' < 'apple';  // true   ← uppercase letters sort before all lowercase
'B'.charCodeAt(0);   // 66
'a'.charCodeAt(0);   // 97
```

The `<` and `>` operators compare UTF-16 code units, so all capitals come before all lowercase letters. Options for comparing text the way a human expects:

```ts
a.toLowerCase().localeCompare(b.toLowerCase());
a.localeCompare(b, undefined, { sensitivity: 'base' }); // ignores case and accents
```

`localeCompare` returns a negative number, zero, or a positive number, which is exactly what a sort comparator needs.

### Sort comparators

```ts
arr.sort((a, b) => /* negative: a first, positive: b first, 0: keep order */);
```

- Since ES2019, `Array.prototype.sort` is **stable**: items that compare as `0` keep their original relative order.
- A comparator must be **consistent**. If `cmp(a, b) < 0`, then `cmp(b, a)` must be `> 0`, and equal items must return `0`. Inconsistent comparators produce unpredictable orders.
- To reverse a sort, flip the comparator's sign. Reversing the output array afterward also reverses the order of equal items, which breaks stability.

**Self-check**
- Why can mutating an array that's stored in React state cause a bug that appears in a *different* part of the UI from where the mutation happened?
- What does `['b', 'A', 'a', 'B'].sort()` return?
- Why is "flip the comparator" better than "sort ascending, then `.reverse()`" for a stable descending sort?

---

## 8. Debugging methodology

Ticket 04 describes symptoms, not a cause. Treat it as a real bug hunt.

### 1. Reproduce

Follow the steps exactly and confirm you see the reported behavior. If you can't reproduce it, you can't confirm a fix.

### 2. Separate the symptoms

The ticket merges two reports. Two symptoms might have one cause or two. Don't assume, and investigate each one.

### 3. Form a hypothesis and test it cheaply

Think "if X is the cause, then Y should also be true." Then check Y:

- Add a `console.log` of the relevant array **before and after** the suspicious call.
- Watch out: `console.log` of an array in browser devtools can show the array's *current* contents when you expand it, not the contents when it was logged. Log `JSON.stringify(arr)` or `[...arr]` to get a snapshot.
- React DevTools lets you inspect component state live.

### 4. Write a failing test first

Before fixing, make sure a test fails *because of* the bug. This repo already has one (`sortByCategory.test.ts`). Read which tests fail and what the error messages say. They're evidence.

### 5. Fix the root cause, not the symptom

A symptom fix might copy the array inside the component before calling the util. It makes the UI look right, but every other caller of the util is still exposed. The ticket's acceptance criteria explicitly ask for the root cause.

### 6. Confirm

Re-run the reproduction steps and the tests. Consider whether anything else relied on the buggy behavior.

**Self-check**
- What's the difference between a symptom fix and a root-cause fix? Give an example of each for a generic "list shows duplicates" bug.
- Why is `console.log(someArray)` sometimes misleading in the browser?

---

## 9. Transforming data: grouping

Grouping turns a flat list into buckets keyed by some property.

### With `reduce` into a `Map`

```ts
const byTeam = users.reduce((groups, user) => {
  const list = groups.get(user.team) ?? [];
  list.push(user);            // mutating the *new* list we own is fine
  groups.set(user.team, list);
  return groups;
}, new Map<string, User[]>());
```

### With a plain loop

A plain loop is often the most readable choice, and interviewers don't penalize it:

```ts
const byTeam = new Map<string, User[]>();
for (const user of users) {
  if (!byTeam.has(user.team)) byTeam.set(user.team, []);
  byTeam.get(user.team)!.push(user);
}
```

### `Object.groupBy` / `Map.groupBy`

Since ES2024:

```ts
const byTeam = Map.groupBy(users, (u) => u.team);
```

This isn't in this repo's TypeScript `lib` (ES2022). It's worth mentioning, and you'd need to change `tsconfig.json` or write your own.

### Why `Map` over a plain object?

- A `Map` preserves **insertion order** for all keys. Objects reorder integer-like keys.
- A `Map` doesn't collide with keys like `__proto__` or `constructor`.
- `Map` has `.size` and iterates cleanly with `for...of` or `[...map]`.

### Normalizing keys

The grouping **key** doesn't have to be the raw value. You can group by a normalized form (trimmed, lowercased) and display a *label* separately. Decide:
- What key do you group by?
- What label do you display in the header?
- In what order do the groups appear?

### Rendering groups

```tsx
{[...groups].map(([key, items]) => (
  <section key={key}>
    <h2>{labelFor(key)} ({items.length})</h2>
    <Table rows={items} />
  </section>
))}
```

If a table layout repeats per group, that's a signal to extract a small component for the table body, so the grouped and ungrouped views share it.

**Self-check**
- Write (out loud) a function that groups `{ name, team }[]` by team in under 2 minutes.
- If grouping is applied *after* filtering, can an empty group ever appear? What if it's applied *before*?

---

## 10. Data fetching: loading, error, and cleanup

### Model the states explicitly

A fetch is always in one of these states: **loading**, **error**, or **success**. Separate booleans let impossible combinations exist, like `loading: true` and `error: 'x'` at the same time.

```ts
// ❌ Possible to be loading AND errored AND have data
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<User[]>([]);

// ✅ Discriminated union: exactly one state at a time
type FetchState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: T };
```

Narrowing on a discriminated union makes TypeScript enforce that you only touch `data` in the success branch:

```tsx
if (state.status === 'loading') return <Spinner />;
if (state.status === 'error') return <ErrorMessage message={state.error} />;
return <Table rows={state.data} />; // TS knows `data` exists here
```

Separate booleans are also acceptable in an interview if you can explain the trade-off.

### `fetch` does not reject on HTTP errors

```ts
const res = await fetch('/api/users');
// A 404 or 500 does NOT throw. `fetch` only rejects on network failure.
if (!res.ok) {
  throw new Error(`Request failed: ${res.status}`);
}
const body = await res.json();
```

Where should this check live: in the API client, or in each component? Think about which choice makes the check impossible to forget.

### Retrying

A "Retry" button needs to trigger the fetch again. Common approaches:
- Put the fetch logic in a function that both the effect and the button call.
- Keep a `reloadKey` counter in state, include it in the effect's dependency array, and increment it to re-run the effect.

### Race conditions and unmounting

If a component unmounts (or re-requests) while a fetch is in flight, the old request's `.then` can still run later and set state. Two standard guards:

```tsx
// 1. An "ignore" flag
useEffect(() => {
  let ignore = false;
  fetchUsers().then((data) => {
    if (!ignore) setUsers(data);
  });
  return () => { ignore = true; };
}, []);

// 2. AbortController (actually cancels the network request)
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/users', { signal: controller.signal })
    .then(/* ... */)
    .catch((err) => {
      if (err.name === 'AbortError') return; // expected; not a real error
      /* handle real errors */
    });
  return () => controller.abort();
}, []);
```

**Strict Mode note:** in development, React 18+ Strict Mode mounts, unmounts, and remounts every component once to surface missing cleanups. This repo uses `<StrictMode>`, so you'll see effects run twice in dev. That's intended, and cleanup makes it harmless.

### Unhandled rejections

Every promise chain needs a `.catch`, or an `await` inside a `try/catch`. Otherwise failures appear as "Uncaught (in promise)" in the console, which is what this app currently does when the API is down.

### How to test it manually

- **Loading:** the API already has ~600ms latency. Browser devtools' Network tab can throttle further.
- **Error:** run only `npm run dev:web`, or stop the API while the page is open, then reload.

**Self-check**
- Why doesn't `fetch` throw on a 500? Where in this repo does that matter?
- What bug does the "ignore flag" pattern prevent?
- Why does a discriminated union make an "impossible state" impossible?

---

## 11. Accessibility basics for dynamic UI

Accessible markup is also what makes components easy to test, because Testing Library queries by role and label (see [section 12](#12-testing-with-vitest-and-react-testing-library)).

| Need | Markup |
| ---- | ------ |
| Label a form control | `<label>Search <input /></label>`, or `<label htmlFor="q">` + `<input id="q">`, or `aria-label` |
| Announce a status update politely (loading, "12 results") | `role="status"` (implies `aria-live="polite"`) |
| Announce an error urgently | `role="alert"` (implies `aria-live="assertive"`) |
| Group of related sections | `<section aria-labelledby="heading-id">` with a matching heading `id` |
| Search input | `<input type="search">` gets a clear button and a `searchbox` role |

Rules of thumb:
- Every input needs a visible label, or at least an accessible name.
- Use a real `<button>` for things you click, not a `<div onClick>`.
- Don't convey meaning with color alone. The status badges in this repo show text as well as color.

**Self-check**
- What role would you give a "Loading entities…" message? What about "Failed to load"?
- How would a screen reader user know that the search results changed?

---

## 12. Testing with Vitest and React Testing Library

### Vitest basics

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
});
```

| Matcher | Use |
| ------- | --- |
| `toBe` | Primitives, same reference |
| `toEqual` | Deep equality for arrays and objects |
| `not.toBe(x)` | Assert a *different* reference (useful for immutability) |
| `toThrow` / `not.toThrow` | Pass a function: `expect(() => fn()).toThrow()` |
| `toHaveBeenCalledTimes(n)` | On a `vi.fn()` or spy |

Run one file with `npx vitest run path/to/file.test.ts`. Temporarily focus a test with `it.only` (never commit it).

### Fake timers

Fake timers let a test control `Date.now()`, `setTimeout`, and `setInterval`.

```ts
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-01T00:00:00Z')); // Date.now() returns this
});
afterEach(() => {
  vi.useRealTimers(); // always restore
});

it('fires after the delay', () => {
  const cb = vi.fn();
  setTimeout(cb, 300);
  vi.advanceTimersByTime(299);
  expect(cb).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(cb).toHaveBeenCalledOnce();
});
```

Read `src/utils/formatRelativeTime.test.ts` to see this in use.

### React Testing Library philosophy

> Test the component the way a user uses it.

Don't test state variables, internal functions, or CSS class names. Test what appears on screen and what happens when the user interacts.

### Query priority

Prefer queries near the top of this list:

1. `getByRole('button', { name: /retry/i })`. This is the best default, and it also checks accessibility.
2. `getByLabelText('Search')`
3. `getByText('No results')`
4. `getByTestId(...)`. Use this only as a last resort.

### Query variants

| Variant | No match | Multiple matches | Async? | Use for |
| ------- | -------- | ---------------- | ------ | ------- |
| `getBy…` | throws | throws | no | Something that should be there now |
| `queryBy…` | `null` | throws | no | Asserting something is **absent** |
| `findBy…` | rejects | rejects | **yes** | Something that appears **later** (after a fetch) |
| `getAllBy…` / `findAllBy…` | throws / rejects | returns array | — | Lists of rows |

```tsx
render(<UserList />);
expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument(); // waits for fetch
expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
```

### Scoping queries with `within`

To check the **order** of table rows, get the rows and look inside each one:

```tsx
import { within } from '@testing-library/react';

const rows = screen.getAllByRole('row').slice(1); // skip header row
const names = rows.map((row) => within(row).getAllByRole('cell')[0].textContent);
expect(names).toEqual(['Ada', 'Grace', 'Linus']);
```

### User interaction

```tsx
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
await user.click(screen.getByRole('checkbox', { name: /show archived/i }));
await user.type(screen.getByLabelText('Search'), 'ada');
```

`userEvent` simulates real browser event sequences (focus, keydown, input, keyup). Prefer it over `fireEvent`.

**Fake timers with `userEvent`:** if a test uses fake timers (for example, to test debounce), tell `userEvent` how to advance them, or it will hang waiting on its own internal delays:

```ts
vi.useFakeTimers();
const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
```

### Mocking the network

Component tests must not hit a real server. Two common approaches:

```ts
// Option A: mock the API module the component imports
vi.mock('../api/users', () => ({
  fetchUsers: vi.fn(),
}));
import { fetchUsers } from '../api/users';

beforeEach(() => {
  vi.mocked(fetchUsers).mockResolvedValue([{ id: '1', name: 'Ada' }]);
});

// Option B: stub global fetch
beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify({ data: [/* ... */] }), { status: 200 }),
  );
});
afterEach(() => {
  vi.restoreAllMocks();
});
```

Trade-off: Option A is simpler and isolates the component. Option B also exercises the real API client, including its error handling. Both are reasonable; pick one and say why.

To test error states, use `mockRejectedValue(new Error('boom'))`, or a `Response` with `status: 500`.

To test loading states, return a promise you control:

```ts
let resolve!: (v: User[]) => void;
vi.mocked(fetchUsers).mockReturnValue(new Promise((r) => { resolve = r; }));
render(<UserList />);
expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
resolve([]);
```

### `act` warnings

If you see *"An update to X inside a test was not wrapped in act(...)"*, a state update happened after your test stopped waiting. The fix is almost always to `await` a `findBy…` or `waitFor` for the final UI, not to wrap things in `act` manually.

### Good test hygiene

- **Arrange, Act, Assert**: set up data, do one thing, check the result.
- Keep each test independent. Mock setup goes in `beforeEach`, and cleanup goes in `afterEach` (RTL's `cleanup` already runs in `src/test/setup.ts`).
- Use a small factory function for test data. The sort test file's `makeEntity` is an example.
- Name tests by behavior: `'shows an error message when the request fails'`, not `'test error'`.
- A test that fails for the right reason before the fix, and passes after it, is the most convincing kind.

**Self-check**
- When would you use `queryByText` instead of `getByText`?
- How would you assert that a list is in a particular *order*?
- Why does `userEvent` need special setup with fake timers?
- Name one advantage of mocking the API module and one advantage of mocking `fetch`.

---

## 13. Suggested order and time boxes

Real interview exercises are usually 45–90 minutes for one or two tickets. Practice with a timer.

| Order | Ticket | Suggested time box | Why this order |
| ----- | ------ | ------------------ | -------------- |
| 1 | 07: EntityList tests (initial version) | 30 min | Builds a safety net and forces you to read the component closely |
| 2 | 04: Sort bug | 30 min | Reading and debugging, which is a different skill from building |
| 3 | 06: Loading and error states | 30 min | Changes how data arrives, so do it before layering features on top |
| 4 | 01: Filter by status | 20 min | Simplest feature; establishes your transform pipeline |
| 5 | 02: Search with debounce | 30 min | Builds on 01's pipeline and adds timing |
| 6 | 03: Relative time | 30 min | Self-contained util with a test suite ready to go |
| 7 | 05: Group by category | 30 min | Uses everything above: transforms, normalization, rendering |

After each ticket:
1. Run `npm test` and `npm run typecheck`.
2. Commit with a message that references the ticket, e.g. `TE-101: filter entity list by status`.
3. Write your reflection in `NOTES.md` while it's fresh.

### A final checklist to rehearse

Before saying "done" in an interview, say (and do) the following:

- [ ] "Let me re-read the acceptance criteria and check each one."
- [ ] "Let me run the tests and the type checker."
- [ ] "Let me check the console for warnings."
- [ ] "Here's an edge case I handled, and here's one I'd handle with more time."
- [ ] "If I were to extend this, I'd…"
