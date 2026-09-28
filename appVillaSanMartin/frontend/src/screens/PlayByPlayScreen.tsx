import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useFetch } from '../hooks/useFetch';
import { theme } from '../theme';
import type { CSSProperties } from 'react';
import type { PlayByPlay } from '../types';

export function PlayByPlayScreen() {
  const { matchId } = useParams();
  const [quarter, setQuarter] = useState('');
  const url = `/game-center/${matchId}/plays${quarter ? `?quarter=${quarter}` : ''}`;
  const { data, loading, error, refetch } = useFetch<PlayByPlay[]>(url);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Play-by-play</h1>
        <button onClick={refetch} style={styles.refreshBtn}>Actualizar</button>
      </div>
      <div style={styles.filters}>
        {['', '1', '2', '3', '4'].map((item) => (
          <button
            key={item || 'all'}
            onClick={() => setQuarter(item)}
            style={{ ...styles.filterBtn, ...(quarter === item ? styles.filterActive : {}) }}
          >
            {item ? `Q${item}` : 'Todos'}
          </button>
        ))}
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {!data || data.length === 0 ? (
        <EmptyState message="Sin jugadas cargadas" />
      ) : (
        <div style={styles.timeline}>
          {[...data].reverse().map((play) => (
            <article key={play.id} style={styles.row}>
              <div style={styles.time}>
                <strong>Q{play.quarter}</strong>
                <span>{play.clock}</span>
              </div>
              <div style={styles.content}>
                <span style={styles.event}>{play.eventType}</span>
                <p style={styles.description}>{play.description}</p>
                <small style={styles.score}>{play.homeScore} - {play.awayScore}</small>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, color: theme.colors.text, fontSize: theme.fontSizes.title },
  refreshBtn: { padding: '0.45rem 0.8rem', borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface, cursor: 'pointer' },
  filters: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  filterBtn: { padding: '0.4rem 0.75rem', borderRadius: theme.borderRadius.full, border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface, cursor: 'pointer' },
  filterActive: { backgroundColor: theme.colors.primary, color: theme.colors.white, borderColor: theme.colors.primary },
  timeline: { display: 'flex', flexDirection: 'column', gap: '0.55rem' },
  row: { display: 'flex', gap: '0.75rem', backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, padding: '0.85rem', boxShadow: theme.shadows.card },
  time: { width: '58px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: theme.colors.primary },
  content: { flex: 1 },
  event: { color: theme.colors.secondary, fontSize: theme.fontSizes.xs, fontWeight: 800 },
  description: { margin: '0.25rem 0', color: theme.colors.text },
  score: { color: theme.colors.textMuted },
  error: { color: theme.colors.error },
};
