import { useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useFetch } from '../hooks/useFetch';
import { theme } from '../theme';
import type { CSSProperties } from 'react';
import type { Standing } from '../types';

export function StandingsScreen() {
  const currentYear = new Date().getFullYear();
  const [season, setSeason] = useState(String(currentYear));
  const { data, loading, error, refetch } = useFetch<Standing[]>(`/standings?season=${season}`);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Posiciones</h1>
        <div style={styles.actions}>
          <input value={season} onChange={(event) => setSeason(event.target.value)} style={styles.input} />
          <button onClick={refetch} style={styles.refreshBtn}>Actualizar</button>
        </div>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {!data || data.length === 0 ? (
        <EmptyState message="No hay tabla de posiciones cargada" />
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['#', 'Equipo', 'PJ', 'G', 'P', 'PF', 'PC', '+/-', 'Racha'].map((head) => (
                  <th key={head} style={styles.th}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row.id}>
                  <td style={styles.td}>{row.position ?? index + 1}</td>
                  <td style={styles.td}><strong>{row.teamName}</strong></td>
                  <td style={styles.td}>{row.played}</td>
                  <td style={styles.td}>{row.wins}</td>
                  <td style={styles.td}>{row.losses}</td>
                  <td style={styles.td}>{row.pointsFor}</td>
                  <td style={styles.td}>{row.pointsAgainst}</td>
                  <td style={styles.td}>{row.pointDifference}</td>
                  <td style={styles.td}>{row.streak || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' },
  title: { margin: 0, color: theme.colors.text, fontSize: theme.fontSizes.title },
  actions: { display: 'flex', gap: '0.5rem' },
  input: { width: '90px', padding: '0.55rem', borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}` },
  refreshBtn: { padding: '0.55rem 0.8rem', borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface, cursor: 'pointer' },
  tableWrap: { overflowX: 'auto', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md, boxShadow: theme.shadows.card },
  table: { width: '100%', minWidth: '720px', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.textMuted },
  td: { padding: '0.75rem', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.text },
  error: { color: theme.colors.error },
};
