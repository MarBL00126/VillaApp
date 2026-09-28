import { useParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useFetch } from '../hooks/useFetch';
import { theme } from '../theme';
import type { CSSProperties } from 'react';
import type { BoxScore } from '../types';

export function BoxScoreScreen() {
  const { matchId } = useParams();
  const { data, loading, error, refetch } = useFetch<BoxScore[]>(`/game-center/${matchId}/box-score`);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Box score</h1>
        <button onClick={refetch} style={styles.refreshBtn}>Actualizar</button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {!data || data.length === 0 ? (
        <EmptyState message="Sin estadísticas cargadas para este partido" />
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Jugador', 'MIN', 'PTS', 'REB', 'AST', 'ROB', 'TAP', 'FG', '3P', '+/-'].map((head) => (
                  <th key={head} style={styles.th}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td style={styles.td}>{row.playerName}</td>
                  <td style={styles.td}>{row.minutes}</td>
                  <td style={styles.td}>{row.points}</td>
                  <td style={styles.td}>{row.rebounds}</td>
                  <td style={styles.td}>{row.assists}</td>
                  <td style={styles.td}>{row.steals}</td>
                  <td style={styles.td}>{row.blocks}</td>
                  <td style={styles.td}>{row.fgMade}/{row.fgAtt}</td>
                  <td style={styles.td}>{row.threeMade}/{row.threeAtt}</td>
                  <td style={styles.td}>{row.plusMinus}</td>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, color: theme.colors.text, fontSize: theme.fontSizes.title },
  refreshBtn: { padding: '0.45rem 0.8rem', borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface, cursor: 'pointer' },
  tableWrap: { overflowX: 'auto', backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md, boxShadow: theme.shadows.card },
  table: { width: '100%', minWidth: '760px', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '0.75rem', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.textMuted },
  td: { padding: '0.75rem', borderBottom: `1px solid ${theme.colors.border}`, color: theme.colors.text },
  error: { color: theme.colors.error },
};
