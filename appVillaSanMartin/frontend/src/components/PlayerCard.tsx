import { theme } from '../theme';
import type { Player } from '../types';

interface Props {
  player: Player;
  onClick?: () => void;
}

export function PlayerCard({ player, onClick }: Props) {
  return (
    <div style={{ ...styles.card, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div style={styles.avatar}>
        <span style={styles.number}>#{player.shirtNumber}</span>
      </div>
      <div style={styles.info}>
        <p style={styles.name}>{player.name} {player.surname}</p>
        <p style={styles.position}>{player.position}</p>
        <p style={styles.meta}>{player.height}m · {player.nationality}</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: '1rem',
    boxShadow: theme.shadows.card,
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'box-shadow 0.15s',
  },
  avatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: theme.colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  number: {
    color: theme.colors.secondary,
    fontWeight: 700,
    fontSize: theme.fontSizes.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 700,
    color: theme.colors.text,
    margin: 0,
    fontSize: theme.fontSizes.md,
  },
  position: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: 600,
    margin: '0.1rem 0',
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.xs,
    margin: 0,
  },
};
