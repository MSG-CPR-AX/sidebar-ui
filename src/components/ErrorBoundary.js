// components/ErrorBoundary.js
// A React error boundary to catch unhandled exceptions in the
// component tree and display a user‑friendly error message instead of
// crashing the entire UI.

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log the error to an external service here
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-700 dark:text-red-400">
          <p>예기치 않은 오류가 발생했습니다.</p>
          <p className="text-xs mt-2">{this.state.error && this.state.error.toString()}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;