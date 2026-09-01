import { theme } from '../theme';

interface Props {
  message?: string;
}

export function EmptyState({ message = 'Sin datos disponibles' }: Props) {
  return (
    <div style={styles.wrapper}>
      <span style={styles.icon}>📭</span>
      <p style={styles.text}>{message}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    gap: '0.5rem',
  },
  icon: {
    fontSize: '2rem',
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.sm,
    textAlign: 'center',
  },
};
