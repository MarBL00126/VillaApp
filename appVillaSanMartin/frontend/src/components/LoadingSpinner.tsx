import { theme } from '../theme';

export function LoadingSpinner() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner} />
      <p style={styles.text}>Cargando...</p>
    </div>
  );
}

const spin = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spin;
  document.head.appendChild(style);
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    gap: '1rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: `4px solid ${theme.colors.border}`,
    borderTop: `4px solid ${theme.colors.primary}`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.sm,
  },
};
