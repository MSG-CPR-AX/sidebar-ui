import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Error boundary for the entire application
interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo)
    
    // Optional: Send error to monitoring service
    if (import.meta.env.VITE_SENTRY_DSN) {
      // Sentry error reporting would go here
    }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-sidebar-bg flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-accent-red mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-bookmark-text mb-2">
              Something went wrong
            </h2>
            <p className="text-bookmark-muted mb-6">
              The application encountered an unexpected error. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Extension
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Get the root element
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

// Create React root and render the app
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)

// Performance monitoring
if (import.meta.env.PROD) {
  // Optional: Report web vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    const reportMetric = (metric: any) => {
      console.log('Web Vitals:', metric)
      // Optional: Send to analytics service
    }

    getCLS(reportMetric)
    getFID(reportMetric)
    getFCP(reportMetric)
    getLCP(reportMetric)
    getTTFB(reportMetric)
  }).catch(() => {
    // Ignore web-vitals import errors
  })
}

// Extension-specific initialization
if (typeof chrome !== 'undefined' && chrome.runtime) {
  console.log('SideBeam extension loaded')
  
  // Optional: Send extension ready event
  chrome.runtime.sendMessage({ type: 'EXTENSION_READY' }).catch(() => {
    // Ignore errors if background script is not available
  })
}