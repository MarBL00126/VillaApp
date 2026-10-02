import { Component, type ErrorInfo, type ReactNode } from 'react';
import { theme } from '../theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const RELOAD_KEY = 'chunk-reload-at';

function isChunkLoadError(error: Error) {
  return /dynamically imported module|Importing a module script failed|Loading chunk|Unable to preload CSS/i.test(
    `${error.name} ${error.message}`,
  );
}

// After a deploy, a cached index/service worker may reference chunks that no longer exist.
// Drop the stale caches and reload once (guarded to avoid reload loops).
async function recoverFromStaleBuild() {
  const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
  if (Date.now() - last < 30_000) return;
  sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  try {
    const registrations = await navigator.serviceWorker?.getRegistrations();
    await Promise.all((registrations ?? []).map((r) => r.unregister()));
    const keys = await caches?.keys();
    await Promise.all((keys ?? []).map((k) => caches.delete(k)));
  } catch (e) {
    console.error('Stale build cleanup failed:', e);
  }
  window.location.reload();
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI error boundary:', error, info);
    if (isChunkLoadError(error)) {
      void recoverFromStaleBuild();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.page}>
          <div style={styles.card}>
            <h1 style={styles.title}>Algo salio mal</h1>
            <p style={styles.text}>Actualiza la pagina o vuelve al inicio para continuar.</p>
            <button type="button" style={styles.button} onClick={() => window.location.assign('/')}>
              Ir al inicio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: theme.colors.background,
    padding: '1rem',
  },
  card: {
    maxWidth: '420px',
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: '1.25rem',
    boxShadow: theme.shadows.elevated,
  },
  title: { margin: '0 0 0.5rem', color: theme.colors.text },
  text: { margin: '0 0 1rem', color: theme.colors.textMuted },
  button: {
    border: 'none',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    padding: '0.75rem 1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
};
