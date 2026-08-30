import React from 'react';

interface AppErrorBoundaryState {
  error: Error | null;
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('WHITEROCK application error', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen bg-white px-6 py-20 text-[#1d1d1f]">
          <div className="mx-auto max-w-xl border border-black/15 bg-white p-8 text-center shadow-sm">
            <p className="wr-eyebrow">Page recovery</p>
            <h1 className="mt-4 font-display text-3xl">This page could not be displayed.</h1>
            <p className="mt-4 text-sm leading-6 text-black/65">
              The rest of the website is still available. Reload the page to try again.
            </p>
            <button className="wr-button wr-button--primary mt-8" onClick={() => window.location.reload()}>
              Reload page
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
