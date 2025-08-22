# SideBeam✨ - Chrome Extension Bookmark Manager

A production-ready Chrome MV3 side panel extension for bookmark sharing in closed-network environments with GitLab integration.

## 🌟 Features

### Core Functionality
- **Side Panel Interface**: Native Chrome side panel integration
- **Virtual Scrolling**: Handles 1000+ bookmarks with smooth performance
- **Advanced Search**: Real-time search across titles, URLs, domains, and tags
- **Smart Filtering**: Multi-criteria filtering by tags, categories, colors, and pins
- **GitLab Integration**: CRUD operations route directly to GitLab repositories
- **Local Bookmarks**: Full Chrome bookmarks API integration with real-time sync

### User Experience
- **Keyboard Shortcuts**: Comprehensive hotkey support (⌘/Ctrl+K, ⌘/Ctrl+1-5, etc.)
- **Dark Theme**: Professional dark UI matching modern Chrome extensions
- **Responsive Design**: Optimized for side panel viewport
- **Context Menus**: Right-click operations with full accessibility
- **Multi-select**: Bulk operations with visual feedback
- **Drag & Drop Ready**: Foundation for future drag-and-drop functionality

### Technical Excellence
- **TypeScript**: Strict type safety throughout
- **React 18**: Modern React with Suspense and error boundaries
- **TanStack Query**: Optimized data fetching with caching
- **Tailwind CSS**: Utility-first styling with design tokens
- **Chrome MV3**: Manifest V3 compliance with service worker
- **Performance**: Bundle optimization and code splitting ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Chrome/Chromium browser for testing
- Access to GitLab repository for bookmark data (optional)

### Development Setup

1. **Clone and Install**
   ```bash
   cd sidebar-ui
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:8080
   VITE_GITLAB_BASE_URL=https://gitlab.your-domain.com
   VITE_GITLAB_PROJECT_PATH=your-group/bookmark-project
   
   # Development
   VITE_USE_MOCK=false
   
   # Optional: Error Reporting
   VITE_SENTRY_DSN=your-sentry-dsn
   ```

3. **Start Development Server**
   ```bash
   # With mock data (no backend required)
   npm run dev:mock
   
   # With real API
   npm run dev
   ```

4. **Load Extension in Chrome**
   1. Build the extension: `npm run build`
   2. Open Chrome and navigate to `chrome://extensions/`
   3. Enable "Developer mode" (top right toggle)
   4. Click "Load unpacked"
   5. Select the `sidebar-ui/dist` folder
   6. Pin the extension and click to open side panel

## 🔧 Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with real API
npm run dev:mock         # Start dev server with mock data
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run typecheck        # TypeScript type checking
npm run lint             # ESLint linting
npm run lint:fix         # Fix ESLint issues
npm run format           # Prettier formatting

# Testing
npm run test             # Unit tests with Vitest
npm run test:ui          # Interactive test UI
npm run test:e2e         # End-to-end tests with Playwright

# Storybook
npm run storybook        # Start Storybook dev server
npm run build-storybook  # Build Storybook
```

### Project Structure

```
sidebar-ui/
├── public/
│   ├── manifest.json        # Chrome extension manifest
│   ├── background.js        # Service worker
│   ├── icons/              # Extension icons (16,32,48,128px)
│   └── index.html          # Main entry point
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Atomic UI components
│   │   ├── layout/        # Layout components
│   │   ├── bookmarks/     # Bookmark-specific components
│   │   └── local-bookmarks/ # Local bookmarks components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # API client and utilities
│   ├── styles/            # Global styles and Tailwind config
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main App component
│   └── main.tsx           # React entry point
└── tests/                 # Test files
```

## 🔌 API Integration

### Backend Requirements

The extension expects a REST API with these endpoints:

```
GET /bookmarks              # List all bookmarks
GET /bookmarks/categories   # Get category tree
```

Response format:
```typescript
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

interface Bookmark {
  name: string
  url: string
  domain: string
  category: string
  packages?: PackageNode[]
  meta?: Record<string, unknown>
  sourcePath?: string
  tags?: string[]
}
```

### Mock Data

For development without a backend:

```bash
npm run dev:mock
```

This uses MSW (Mock Service Worker) to provide realistic API responses.

## 📦 Building & Deployment

### Production Build

```bash
npm run build
```

This creates a `dist/` folder with:
- Optimized React bundle
- Chrome extension manifest
- Service worker
- All required assets

### Chrome Extension Installation

1. **Development/Testing**
   ```bash
   npm run build
   # Load dist/ folder in chrome://extensions/
   ```

2. **Package for Distribution**
   ```bash
   npm run build
   cd dist
   zip -r ../sidebeam-extension.zip .
   ```

3. **Chrome Web Store**
   - Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Upload `sidebeam-extension.zip`
   - Fill in store listing details
   - Submit for review

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘/Ctrl + K` | Focus search |
| `⌘/Ctrl + 1-5` | Switch tabs |
| `⌘/Ctrl + A` | Select all bookmarks |
| `⌘/Ctrl + D` | Add selected to local |
| `⌘/Ctrl + F` | Toggle filters |
| `Delete/Backspace` | Delete selected |
| `Enter` | Open bookmark |
| `Esc` | Clear selection |
| `↑/↓` | Navigate items |

## 🎨 Customization

### Design System

The UI uses a carefully crafted design system with:
- **Dark Theme**: Primary interface optimized for side panel
- **Color Palette**: Semantic colors for different bookmark states
- **Typography**: Inter font with proper sizing scale
- **Spacing**: Consistent 4px grid system
- **Components**: Atomic design with reusable components

### Component Architecture

- **Atomic**: `Button`, `Input`, `Icon`, `LoadingSpinner`
- **Molecular**: `BookmarkItem`, `FilterControls`, `SearchBar`
- **Organisms**: `BookmarkList`, `Header`, `Sidebar`
- **Templates**: `Layout`, `TabContent`, `EmptyState`
- **Views**: `BookmarksView`, `LocalBookmarksView`

## 🔒 Security & Privacy

### Content Security Policy
Strict CSP prevents XSS and injection attacks:
```
default-src 'self';
script-src 'self';
img-src 'self' data: https:;
connect-src 'self' https:;
```

### Minimal Permissions
- `sidePanel`: Side panel functionality
- `storage`: User preferences only
- `bookmarks`: Chrome bookmarks access
- `host_permissions`: API connectivity only

### Data Privacy
- No user data collection
- Local storage for preferences
- Optional error reporting
- Chrome bookmarks accessed securely

## 🛠 Troubleshooting

### Common Issues

**Extension won't load:**
- Enable Developer mode in chrome://extensions/
- Check manifest.json syntax
- Review console errors

**API connection fails:**
- Verify VITE_API_BASE_URL configuration
- Check backend CORS settings
- Try mock mode for testing

**Build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (18+)
- Verify TypeScript configuration

### Debug Tools

- Chrome DevTools for frontend debugging
- Extension DevTools in chrome://extensions/
- React DevTools for component inspection
- Network tab for API debugging

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript strict mode
2. Use Prettier for code formatting
3. Write tests for new features
4. Update documentation
5. Follow conventional commit messages

### Pull Request Process
1. Create feature branch from main
2. Implement feature with tests
3. Update relevant documentation
4. Submit PR with clear description
5. Address code review feedback

## 📈 Performance

### Optimization Features
- **Virtual Scrolling**: Handles thousands of bookmarks
- **Code Splitting**: Lazy-loaded components
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: Proper favicon handling
- **Memory Management**: Efficient React patterns

### Monitoring
- Web Vitals integration
- Error boundary protection
- Performance profiling ready
- Bundle size analysis

## 🗺 Roadmap

### Current Status ✅
- Core bookmark management
- Chrome side panel integration
- GitLab CRUD operations
- Local bookmarks sync
- Advanced search and filtering
- Keyboard shortcuts
- Production-ready architecture

### Phase 2 (Upcoming)
- [ ] Drag & drop bookmark reordering
- [ ] Advanced tag management interface
- [ ] Folder hierarchy management
- [ ] Import/export functionality
- [ ] Settings management panel
- [ ] Bulk operations UI

### Phase 3 (Future)
- [ ] Multi-user collaboration features
- [ ] Advanced analytics dashboard
- [ ] Enhanced security features
- [ ] Performance monitoring
- [ ] Accessibility improvements

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🎯 Architecture Decisions

Key technical decisions and rationale:
- **React 18**: Modern React with concurrent features
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first styling for consistency
- **TanStack Query**: Robust data fetching and caching
- **Vite**: Fast build tool with modern defaults
- **Chrome MV3**: Future-proof extension architecture

---

**SideBeam✨** - Professional bookmark management for closed-network environments.

For support and feature requests, please open an issue in the project repository.
