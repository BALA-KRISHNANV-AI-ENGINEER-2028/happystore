// =============================================================================
// Happy Store — Error Boundary
// =============================================================================

import { Component, type ErrorInfo, type ReactNode } from "react";
import { ServerErrorPage } from "./server-error";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, send to error reporting service
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ServerErrorPage />;
    }
    return this.props.children;
  }
}
