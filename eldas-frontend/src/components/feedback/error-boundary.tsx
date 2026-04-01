import { Component, type ErrorInfo, type PropsWithChildren } from "react";

import { ErrorPanel } from "@/components/feedback/error-panel";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled Eldas frontend error", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorPanel message="A rendering error interrupted the page. Refresh to continue." />;
    }

    return this.props.children;
  }
}
