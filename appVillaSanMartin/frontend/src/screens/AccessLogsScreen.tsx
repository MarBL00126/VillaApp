import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { accessService } from '../services/stadiumService';
import { theme } from '../theme';

export function AccessLogsScreen() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    if (!matchId) return;
    const fetchLogs = async () => {
      try {
        const [logsData, summaryData] = await Promise.all([
          accessService.getLogs(parseInt(matchId)),
          accessService.getSummary(parseInt(matchId))
        ]);
        setLogs(logsData);
        setSummary(summaryData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [matchId]);

  const handleExport = () => {
    if (!logs.length) return;
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Hora,Estado,Nombre,Puerta,Tipo\n" +
      logs.map(log => `${new Date(log.scannedAt).toLocaleTimeString('es-AR')},${log.status},${log.name || ''},${log.gate},${log.type}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `accesos_partido_${matchId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    let bg: string = theme.colors.textMuted;
    if (status === 'OK') bg = theme.colors.success;
    if (status === 'DUPLICATE') bg = '#f59e0b';
    if (status === 'INVALID') bg = theme.colors.error;
    
    return <span style={{ padding: '4px 8px', borderRadius: 12, background: bg, color: '#fff', fontSize: '0.8rem' }}>{status}</span>;
  };

  const filteredLogs = filter === 'Todos' ? logs : logs.filter(l => l.status === filter);

  const styles: Record<string, React.CSSProperties> = {
    container: { padding: 20, maxWidth: 1000, margin: '0 auto', fontFamily: 'sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    backBtn: { background: 'none', border: 'none', color: theme.colors.primary, cursor: 'pointer', fontSize: '1rem', padding: 0 },
    summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15, marginBottom: 20 },
    summaryCard: { background: theme.colors.surface, padding: 20, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', border: `1px solid ${theme.colors.border}` },
    summaryNum: { fontSize: '2rem', fontWeight: 'bold', margin: '10px 0 0' },
    filterRow: { display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto' },
    filterPill: { padding: '8px 16px', borderRadius: 20, border: `1px solid ${theme.colors.border}`, background: theme.colors.surface, cursor: 'pointer' },
    activePill: { background: theme.colors.primary, color: '#fff', borderColor: theme.colors.primary },
    table: { width: '100%', borderCollapse: 'collapse', background: theme.colors.surface, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    th: { padding: 15, textAlign: 'left', background: theme.colors.primary, color: '#fff' },
    td: { padding: 15, borderBottom: `1px solid ${theme.colors.border}` },
    exportBtn: { padding: '8px 16px', background: theme.colors.secondary, color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
  };

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Cargando historial...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <button style={styles.backBtn} onClick={() => navigate('/admin')}>← Volver a Admin</button>
          <h1 style={{ margin: '10px 0 0' }}>Historial de Accesos</h1>
          <p style={{ margin: 0, color: theme.colors.textMuted }}>Partido ID: {matchId}</p>
        </div>
        <button style={styles.exportBtn} onClick={handleExport}>Exportar CSV</button>
      </div>

      {summary && (
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <div style={{ color: theme.colors.textMuted }}>Total</div>
            <div style={styles.summaryNum}>{summary.total}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ color: theme.colors.success }}>✅ OK</div>
            <div style={{ ...styles.summaryNum, color: theme.colors.success }}>{summary.ok}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ color: '#f59e0b' }}>⚠️ Duplicados</div>
            <div style={{ ...styles.summaryNum, color: '#f59e0b' }}>{summary.duplicate}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={{ color: theme.colors.error }}>❌ Inválidos</div>
            <div style={{ ...styles.summaryNum, color: theme.colors.error }}>{summary.invalid}</div>
          </div>
        </div>
      )}

      <div style={styles.filterRow}>
        {['Todos', 'OK', 'DUPLICATE', 'INVALID', 'EXPIRED'].map(f => (
          <button 
            key={f} 
            style={{ ...styles.filterPill, ...(filter === f ? styles.activePill : {}) }}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredLogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, background: theme.colors.surface, borderRadius: 8 }}>
          No hay registros para mostrar.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Hora</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Puerta</th>
                <th style={styles.th}>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td style={styles.td}>{new Date(log.scannedAt).toLocaleTimeString('es-AR')}</td>
                  <td style={styles.td}>{getStatusBadge(log.status)}</td>
                  <td style={styles.td}>{log.name || '-'}</td>
                  <td style={styles.td}>{log.gate}</td>
                  <td style={styles.td}>{log.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
