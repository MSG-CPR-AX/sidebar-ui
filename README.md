# Sidebeam: Bookmark Sharing Chrome Extension UI

This repository contains the user interface for Sidebeam, a Chrome side panel extension for managing and sharing bookmarks within a closed network. The application is built with React, TypeScript, and Vite, and styled with Tailwind CSS.

## 🚀 Getting Started

This guide will walk you through setting up and running the project. No prior React experience is required.

### 1. Installation

First, you need to install the necessary tools and libraries. Open your terminal in the project folder and run this single command:

```bash
npm install
```

This command reads the `package.json` file and downloads all the required libraries (like React and Vite) into a folder called `node_modules`. You only need to do this once after cloning the project or when new libraries are added.

### 2. Running the Application

There are two ways to run this application, each for a different purpose.

#### Option A: For UI Development (`npm run dev`)

This is the recommended method for when you are actively developing and changing the UI.

1.  **Run the command:**
    ```bash
    npm run dev
    ```
2.  **What it does:** This starts a **development server**. It watches your code for changes and automatically updates in the browser.
3.  **Mock Data:** In this mode, the application **does not connect to a real backend**. Instead, it loads mock (fake) data from `src/mock-data.ts`. This allows you to work on the UI freely without needing to run a separate backend server.
4.  **How to View:** Open your browser and go to the `localhost` URL shown in the terminal (usually `http://localhost:5173`). You will see the application running live.

#### Option B: For Testing as a Real Extension (`npm run build`)

This method is for testing the application as it would run for a real user, connecting to a live backend.

1.  **Run the command:**
    ```bash
    npm run build
    ```
2.  **What it does:** This command takes all the source code from the `src` folder and creates a final, optimized version of the application in a new folder called `dist`. This `dist` folder is the actual Chrome extension.
3.  **How to Test:**
    *   Make sure your backend server (`sidebeam-backend`) is running.
    *   Open Chrome and navigate to `chrome://extensions`.
    *   Enable "Developer mode" using the switch in the top-right corner.
    *   Click the "Load unpacked" button.
    *   Select the `dist` folder from this project.
    *   The Sidebeam extension will now be installed. Click the icon in your toolbar to open the side panel.

### 📂 Project Structure

Here is an overview of the most important files and folders:

-   **/public/**: Contains static assets that are copied directly into the final `dist` folder, such as `manifest.json` and icons.
-   **/src/**: This is where all the application's source code lives.
    -   **`App.tsx`**: The main component that holds the entire application's state and structure. This is the best place to start understanding the code.
    -   **`main.tsx`**: The entry point of the application.
    -   **/components/**: Contains all the reusable React components (e.g., `Header.tsx`, `BookmarkList.tsx`). Each component is a small, self-contained piece of the UI.
    -   **/services/api.ts**: Contains the logic for fetching data from the backend, including the mock data for development mode.
    -   **/utils/bookmarkUtils.ts**: Contains complex helper functions for processing data, such as building the bookmark tree.
    -   **/mock-data.ts**: The mock data used for development mode.
-   **`package.json`**: Lists all the project's dependencies and defines the scripts (`dev`, `build`).
-   **`vite.config.ts`**: The configuration file for Vite, the build tool.
-   **`tailwind.config.js`**: The configuration file for Tailwind CSS, the styling library.

---
This project was developed by Jules.
