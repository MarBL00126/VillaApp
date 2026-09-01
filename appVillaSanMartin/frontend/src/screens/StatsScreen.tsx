import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { theme } from '../theme';
import type { PlayerStats } from '../types';

type SortKey = 'totalPoints' | 'totalRebounds' | 'totalAssists' | 'totalSteals' | 'totalBlocks';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'totalPoints', label: 'Puntos' },
  { key: 'totalRebounds', label: 'Rebotes' },
  { key: 'totalAssists', label: 'Asistencias' },
  { key: 'totalSteals', label: 'Robos' },
  { key: 'totalBlocks', label: 'Tapones' },
];

export function StatsScreen() {
  const [sortKey, setSortKey] = useState<SortKey>('totalPoints');
  const { data: stats, loading, error, refetch } = useFetch<PlayerStats[]>('/stats');

  const sorted = stats
    ? [...stats].sort((a, b) => b[sortKey] - a[sortKey])
    : [];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Estadísticas</h1>
        <button onClick={refetch} style={styles.refreshBtn}>⟳</button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Selector de métrica */}
      <div style={styles.filters}>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortKey(opt.key)}
            style={{
              ...styles.filterBtn,
              ...(sortKey === opt.key ? styles.filterActive : {}),
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Ranking */}
      {sorted.length === 0 ? (
        <EmptyState message="Sin estadísticas disponibles" />
      ) : (
        <div style={styles.list}>
          {sorted.map((s, i) => (
            <div key={s.id} style={styles.row}>
              <span style={{ ...styles.rank, ...(i < 3 ? styles.topRank : {}) }}>
                {i + 1}
              </span>
              <div style={styles.playerInfo}>
                <span style={styles.playerName}>
                  {s.player.name} {s.player.surname}
                </span>
                <span style={styles.playerPos}>{s.player.position} · #{s.player.shirtNumber}</span>
              </div>
              <span style={styles.value}>{s[sortKey]}</span>
            </div>
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
  filters: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' },
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
  list: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: '0.875rem 1rem',
    boxShadow: theme.shadows.card,
    border: `1px solid ${theme.colors.border}`,
  },
  rank: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: theme.colors.border,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textMuted,
    flexShrink: 0,
    textAlign: 'center' as const,
    lineHeight: '28px',
  },
  topRank: {
    backgroundColor: theme.colors.secondary,
    color: theme.colors.primary,
  },
  playerInfo: { flex: 1, display: 'flex', flexDirection: 'column' as const, gap: '0.1rem' },
  playerName: { fontWeight: 700, color: theme.colors.text, fontSize: theme.fontSizes.md },
  playerPos: { fontSize: theme.fontSizes.xs, color: theme.colors.textMuted },
  value: { fontWeight: 700, fontSize: theme.fontSizes.xl, color: theme.colors.primary, minWidth: '40px', textAlign: 'right' as const },
};
