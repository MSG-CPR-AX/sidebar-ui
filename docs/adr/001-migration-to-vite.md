# ADR 001: Migration from Create React App to Vite

## Status

Accepted

## Context

The initial project was set up using Create React App (CRA). While CRA is a solid choice for beginners, it has known performance bottlenecks, especially in development with slow startup times and slow Hot Module Replacement (HMR). The project requirements call for a modern, high-performance development environment and a flexible build process.

## Decision

We decided to migrate the entire project from Create React App to Vite.

This involved:
-   Replacing `react-scripts` with `vite` and `@vitejs/plugin-react`.
-   Creating a `vite.config.js` file.
-   Updating the `index.html` to use Vite's entry point convention.
-   Switching from CommonJS-based configuration to ES Modules where possible.

## Consequences

### Positive:
-   **Faster Development:** Vite's use of native ES modules for development leads to near-instant server start and extremely fast HMR.
-   **Better Performance:** Vite's build process uses Rollup under the hood, which is highly optimized for production bundles.
-   **Modern Tooling:** Aligns the project with modern frontend development standards.
-   **Flexibility:** Vite offers more direct control over the build process and configuration compared to the abstracted nature of CRA.

### Negative:
-   **Initial Effort:** The migration required an initial time investment to reconfigure the project, set up tooling (ESLint, etc.), and ensure compatibility.
-   **Ecosystem Differences:** Some tools or conventions that work out-of-the-box with CRA may require specific plugins or configuration for Vite.
