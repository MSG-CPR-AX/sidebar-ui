# ADR 002: State Management with TanStack Query

## Status

Accepted

## Context

The application's primary function is to fetch, cache, and display data from a remote server. This server state has a distinct lifecycle from client state (e.g., UI state like which modal is open). We needed a robust solution for managing asynchronous server state, including caching, background refetching, and request deduplication, to provide a smooth and responsive user experience.

## Decision

We chose TanStack Query (formerly React Query) as the primary library for managing server state.

Client state (UI state) will be managed locally with React's built-in hooks (`useState`, `useReducer`) for now. If more complex global client state is needed, a lightweight library like Zustand will be considered, but TanStack Query will remain the authority for server state.

## Consequences

### Positive:
-   **Declarative Data Fetching:** Simplifies data fetching logic by moving it into reusable hooks.
-   **Automatic Caching:** Out-of-the-box caching reduces redundant network requests and improves perceived performance.
-   **Background Updates:** Keeps data fresh without requiring user interaction.
-   **Developer Experience:** The React Query Devtools provide excellent visibility into the state of all queries, making debugging significantly easier.
-   **Separation of Concerns:** Clearly separates server state from client state, leading to a cleaner architecture.

### Negative:
-   **Learning Curve:** Team members unfamiliar with TanStack Query may need some time to understand its concepts (e.g., `stale-while-revalidate`).
-   **Library Size:** Adds a new dependency to the project bundle, though its benefits for a data-heavy application outweigh the cost.
