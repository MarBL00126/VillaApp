import { Component, type ErrorInfo, type ReactNode } from 'react';
import { theme } from '../theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI error boundary:', error, info);
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
