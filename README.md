# SideBeam - Bookmark Sharing Chrome Extension

SideBeam is a Chrome extension that provides a powerful bookmark sharing and management tool within the browser's side panel. It is designed for teams to share and manage common URLs within a closed network, with all bookmark data being version-controlled in GitLab.

This repository contains the frontend UI for the SideBeam extension, built with React, TypeScript, and Vite.

## Features

-   View and search shared bookmarks from GitLab.
-   Organize bookmarks with folders and tags.
-   Drag-and-drop interface for folder management.
-   Seamless integration with the Chrome Side Panel.
-   (Future) Sync with local browser bookmarks.

## Tech Stack

-   **Framework**: React 18 + TypeScript
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **State Management**: TanStack Query
-   **Drag & Drop**: dnd-kit
-   **Testing**: Vitest + React Testing Library
-   **Linting & Formatting**: ESLint, Prettier

## Development

### Prerequisites

-   Node.js (v18 or later)
-   npm

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd sidebar-ui
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Development Server

The application can be run against a mock server (for UI development) or a live backend.

-   **To run with the mock server:**
    The mock server is enabled by default in development mode.
    ```bash
    npm run dev
    ```
    This will start a Vite development server.

### Building the Extension

To build the extension for production, run:
```bash
npm run build
```
This will create a `dist/` directory containing the optimized and bundled extension files, ready to be loaded into Chrome.

### Loading the Extension in Chrome

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable "Developer mode" in the top right corner.
3.  Click "Load unpacked".
4.  Select the `dist` directory from this project.
5.  The SideBeam icon should appear in your extensions list, and you can open it in the side panel.

## Testing

To run the unit and integration tests, use:
```bash
npm test
```
