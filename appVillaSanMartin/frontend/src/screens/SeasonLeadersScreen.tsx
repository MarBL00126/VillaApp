import { useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useFetch } from '../hooks/useFetch';
import { theme } from '../theme';
import type { CSSProperties } from 'react';
import type { SeasonLeader } from '../types';

const CATEGORIES = [
  { value: 'points', label: 'Puntos' },
  { value: 'rebounds', label: 'Rebotes' },
  { value: 'assists', label: 'Asistencias' },
  { value: 'steals', label: 'Robos' },
  { value: 'blocks', label: 'Tapones' },
];

export function SeasonLeadersScreen() {
  const currentYear = new Date().getFullYear();
  const [season, setSeason] = useState(String(currentYear));
  const [category, setCategory] = useState('points');
  const { data, loading, error } = useFetch<SeasonLeader[]>(`/stats/leaders?season=${season}&category=${category}`);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Líderes de temporada</h1>
        <input value={season} onChange={(event) => setSeason(event.target.value)} style={styles.input} />
      </div>
      <div style={styles.filters}>
        {CATEGORIES.map((item) => (
          <button
            key={item.value}
            onClick={() => setCategory(item.value)}
            style={{ ...styles.filterBtn, ...(category === item.value ? styles.filterActive : {}) }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {!data || data.length === 0 ? (
        <EmptyState message="No hay líderes cargados para esta temporada" />
      ) : (
        <div style={styles.list}>
          {data.map((leader, index) => (
            <article key={leader.playerId} style={styles.row}>
              <span style={styles.rank}>{index + 1}</span>
              <div style={styles.info}>
                <strong>{leader.playerName}</strong>
                <small>{leader.playedGames} partidos · Prom. {leader.average}</small>
              </div>
              <strong style={styles.value}>{leader.total}</strong>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' },
  title: { margin: 0, color: theme.colors.text, fontSize: theme.fontSizes.title },
  input: { width: '90px', padding: '0.55rem', borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}` },
  filters: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  filterBtn: { padding: '0.45rem 0.8rem', borderRadius: theme.borderRadius.full, border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface, cursor: 'pointer' },
  filterActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.white },
  list: { display: 'flex', flexDirection: 'column', gap: '0.55rem' },
  row: { display: 'flex', alignItems: 'center', gap: '0.85rem', backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, padding: '0.85rem', boxShadow: theme.shadows.card },
  rank: { width: '30px', height: '30px', borderRadius: '50%', display: 'grid', placeItems: 'center', backgroundColor: theme.colors.secondary, color: theme.colors.primary, fontWeight: 800 },
  info: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' },
  value: { color: theme.colors.primary, fontSize: theme.fontSizes.xl },
  error: { color: theme.colors.error },
};
