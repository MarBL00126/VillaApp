import { theme } from '../theme';
import type { Match } from '../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  match: Match;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isPast(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export function MatchCard({ match }: Props) {
  const navigate=useNavigate();
  const past = isPast(match.matchDate);
  const won = past && match.teamPoints > match.opponentPoints;
  const lost = past && match.teamPoints < match.opponentPoints;
  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <span style={{ ...styles.badge, backgroundColor: match.isLocal ? theme.colors.primary : theme.colors.textMuted }}>
          {match.isLocal ? 'LOCAL' : 'VISITANTE'}
        </span>
        {past && (
          <span style={{ ...styles.result, color: won ? theme.colors.success : lost ? theme.colors.error : theme.colors.textMuted }}>
            {won ? '✓ Victoria' : lost ? '✗ Derrota' : '— Empate'}
          </span>
        )}
      </div>

      <p style={styles.opponent}>vs {match.opponent}</p>

      <p style={styles.date}>
        {formatDate(match.matchDate)} · {formatTime(match.matchDate)}
      </p>

      {past ? (
        <p style={styles.score}>
          {match.teamPoints} — {match.opponentPoints}
        </p>
      ) : (
        <>
        <p style={{ ...styles.score, color: theme.colors.secondary }}>Próximo</p>
        
          {!past && (
            <button
              style={styles.buyButton}
              onClick={() => navigate(`/matches/${match.id}/tickets`)}
            >
              Comprar entrada
            </button>
          )}
          </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: '1.25rem',
    boxShadow: theme.shadows.card,
    border: `1px solid ${theme.colors.border}`,
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  badge: {
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '0.2rem 0.6rem',
    borderRadius: theme.borderRadius.full,
    letterSpacing: '0.05em',
  },
  result: {
    fontSize: theme.fontSizes.xs,
    fontWeight: 600,
  },
  opponent: {
    fontWeight: 700,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.text,
    margin: '0.25rem 0',
  },
  buyButton: {
  width: '100%',
  marginTop: '1rem',
  padding: '0.75rem 1rem',
  border: 'none',
  borderRadius: theme.borderRadius.md,
  backgroundColor: theme.colors.primary,
  color: '#fff',
  fontSize: theme.fontSizes.sm,
  fontWeight: 700,
  cursor: 'pointer',
},
  date: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.sm,
    margin: '0.25rem 0',
  },
  score: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: 700,
    color: theme.colors.text,
    margin: '0.5rem 0 0',
  },
};
