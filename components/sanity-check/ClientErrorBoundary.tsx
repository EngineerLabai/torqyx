"use client";

import { Component, type ReactNode } from "react";

type ClientErrorBoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
};

type ClientErrorBoundaryState = {
  hasError: boolean;
};

export default class ClientErrorBoundary extends Component<ClientErrorBoundaryProps, ClientErrorBoundaryState> {
  state: ClientErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[sanity-check] client error:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
