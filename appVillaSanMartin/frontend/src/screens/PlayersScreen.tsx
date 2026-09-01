import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { PlayerCard } from '../components/PlayerCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { theme } from '../theme';
import type { Player } from '../types';

const ALL = 'Todos';
const POSITIONS = [ALL, 'Base', 'Escolta', 'Alero', 'Ala-Pivot', 'Pivot'];

export function PlayersScreen() {
  const navigate = useNavigate();
  const { data: players, loading, error, refetch } = useFetch<Player[]>('/players');
  const [filter, setFilter] = useState(ALL);

  const filtered = players
    ? filter === ALL
      ? players
      : players.filter((p) => p.position === filter)
    : [];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Plantel</h1>
        <button onClick={refetch} style={styles.refreshBtn}>⟳</button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Filtros por posición */}
      <div style={styles.filters}>
        {POSITIONS.map((pos) => (
          <button
            key={pos}
            onClick={() => setFilter(pos)}
            style={{
              ...styles.filterBtn,
              ...(filter === pos ? styles.filterActive : {}),
            }}
          >
            {pos}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No hay jugadores en esta posición" />
      ) : (
        <div style={styles.list}>
          {filtered.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onClick={() => navigate(`/players/${player.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  title: { margin: 0, color: theme.colors.text, fontSize: theme.fontSizes.xxl, fontWeight: 700 },
  refreshBtn: {
    background: 'none',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: '0.3rem 0.75rem',
    cursor: 'pointer',
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textMuted,
  },
  error: { color: theme.colors.error, fontSize: theme.fontSizes.sm },
  filters: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1.25rem',
  },
  filterBtn: {
    padding: '0.35rem 0.9rem',
    borderRadius: theme.borderRadius.full,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    color: theme.colors.textMuted,
    cursor: 'pointer',
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
  },
  filterActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    color: theme.colors.white,
    fontWeight: 700,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
};
