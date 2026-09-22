import { theme } from '../theme';
import type { Player } from '../types';

interface Props {
  player: Player;
  onClick?: () => void;
  isFavorite?: boolean;
  onFavorite?: () => void;
}

export function PlayerCard({ player, onClick, isFavorite = false, onFavorite }: Props) {
  return (
    <div style={{ ...styles.card, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      {player.imageUrl ? (
        <img src={player.imageUrl} alt={`${player.name} ${player.surname}`} style={styles.avatarImg} />
      ) : (
        <div style={styles.avatar}>
          <span style={styles.number}>#{player.shirtNumber}</span>
        </div>
      )}
      <div style={styles.info}>
        <p style={styles.name}>{player.name} {player.surname}</p>
        <p style={styles.position}>{player.position}</p>
        <p style={styles.meta}>{player.height}m · {player.nationality}</p>
        <p style={styles.meta}>{player.favoriteCount ?? 0} favoritos</p>
      </div>
      {onFavorite && (
        <button
          type="button"
          aria-label={isFavorite ? 'Quitar favorito' : 'Marcar favorito'}
          title={isFavorite ? 'Quitar favorito' : 'Marcar favorito'}
          style={{ ...styles.favoriteBtn, ...(isFavorite ? styles.favoriteActive : {}) }}
          onClick={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      )}
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
  avatarImg: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
    backgroundColor: theme.colors.border,
  },
  favoriteBtn: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textMuted,
    cursor: 'pointer',
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
    flexShrink: 0,
  },
  favoriteActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
    color: theme.colors.primary,
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
