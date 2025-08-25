# ADR 003: UI Component Styling with Tailwind CSS

## Status

Accepted

## Context

The project requires building a production-quality UI that closely matches a reference design. We needed a styling solution that was fast, maintainable, and allowed for the creation of a consistent design system (colors, spacing, etc.). Traditional CSS-in-JS libraries or plain CSS with BEM can become difficult to manage at scale.

## Decision

We chose Tailwind CSS as the utility-first CSS framework for this project.

All styling will be done directly in the JSX of the components using Tailwind's utility classes. A `tailwind.config.js` file will be used to define and enforce design tokens (e.g., custom color palettes, spacing units) to ensure consistency with the reference design.

## Consequences

### Positive:
-   **Rapid Prototyping:** Allows for extremely fast UI development without leaving the HTML/JSX.
-   **Consistency:** By using predefined design tokens, it's easier to maintain visual consistency across the entire application.
-   **Performance:** Tailwind automatically removes unused CSS during the build process, resulting in a highly optimized, small final CSS file.
-   **Maintainability:** Component styles are co-located with the component's logic and structure, making them easier to reason about and modify. It avoids the problem of global CSS conflicts.

### Negative:
-   **Verbose JSX:** The extensive use of utility classes can make the JSX look cluttered, which can be a drawback for developers new to the paradigm.
-   **Learning Curve:** Requires learning Tailwind's specific class names, though they are generally intuitive.
-   **Requires PostCSS:** Adds a build-step dependency on PostCSS to process the utility classes.
