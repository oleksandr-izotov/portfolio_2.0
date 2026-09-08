import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  // Without this the crash is swallowed: the visitor sees the fallback and the
  // stack never reaches the console, which makes a bug report unactionable.
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-blue-500 mb-6">
            System Error
          </p>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">
            Something went wrong
          </h1>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 border border-white/10 text-[11px] font-mono font-bold uppercase tracking-widest text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
