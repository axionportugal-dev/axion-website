import {
  Component,
  type ReactNode,
} from 'react';

interface PageLoadBoundaryProps {
  children: ReactNode;
}

interface PageLoadBoundaryState {
  failed: boolean;
}

/*
 * Pages are loaded on demand (see lazyPage.tsx). If a page cannot be
 * fetched at all (e.g. the visitor went offline), show a quiet way back
 * instead of a blank screen.
 */
export default class PageLoadBoundary extends Component<
  PageLoadBoundaryProps,
  PageLoadBoundaryState
> {
  state: PageLoadBoundaryState = {
    failed: false,
  };

  static getDerivedStateFromError(): PageLoadBoundaryState {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-dvh w-full flex-col items-center justify-center gap-6 bg-[#010103] px-6 text-center text-white">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.36em] text-sky-400/80">
          AXION
        </span>

        <p className="max-w-xs text-sm font-medium leading-relaxed text-white/70">
          Não foi possível carregar esta página. Verifique a ligação e tente
          novamente.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full border border-sky-400/40 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300 transition-colors hover:border-sky-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
        >
          Tentar novamente
        </button>
      </main>
    );
  }
}
