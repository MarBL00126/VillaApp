import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { MatchCard } from '../components/MatchCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { theme } from '../theme';
import type { Match } from '../types';

type Tab = 'proximos' | 'resultados';

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

export function FixtureScreen() {
  const [tab, setTab] = useState<Tab>('proximos');

  const { data: fixture, loading: l1, error: e1, refetch: r1 } = useFetch<Match[]>('/fixture');
  const { data: allMatches, loading: l2, error: e2, refetch: r2 } = useFetch<Match[]>('/matches');

  const pastMatches = allMatches
    ? [...allMatches]
        .filter((m) => isPast(m.matchDate))
        .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
    : [];

  const loading = l1 || l2;
  const error = e1 || e2;

  function handleRefetch() {
    r1();
    r2();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Fixture</h1>
        <button onClick={handleRefetch} style={styles.refreshBtn}>⟳</button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setTab('proximos')}
          style={{ ...styles.tab, ...(tab === 'proximos' ? styles.tabActive : {}) }}
        >
          Próximos ({fixture?.length ?? 0})
        </button>
        <button
          onClick={() => setTab('resultados')}
          style={{ ...styles.tab, ...(tab === 'resultados' ? styles.tabActive : {}) }}
        >
          Resultados ({pastMatches.length})
        </button>
      </div>

      {/* Contenido */}
      {tab === 'proximos' ? (
        fixture && fixture.length > 0 ? (
          <div style={styles.list}>
            {fixture.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        ) : (
          <EmptyState message="No hay próximos partidos cargados" />
        )
      ) : (
        pastMatches.length > 0 ? (
          <div style={styles.list}>
            {pastMatches.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        ) : (
          <EmptyState message="Sin resultados disponibles" />
        )
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
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.25rem',
    borderBottom: `2px solid ${theme.colors.border}`,
    paddingBottom: '0',
  },
  tab: {
    padding: '0.6rem 1.25rem',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textMuted,
  },
  tabActive: {
    color: theme.colors.primary,
    fontWeight: 700,
    borderBottomColor: theme.colors.primary,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
};
