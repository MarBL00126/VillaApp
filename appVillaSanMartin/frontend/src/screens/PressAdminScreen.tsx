import React, { useEffect, useState } from 'react';
import { pressService, stadiumService } from '../services/stadiumService';
import api from '../services/api';
import { theme } from '../theme';

export function PressAdminScreen() {
  const [accreditations, setAccreditations] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  
  const [filterMatchId, setFilterMatchId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);

  const [approveModal, setApproveModal] = useState<number | null>(null);
  const [rejectModal, setRejectModal] = useState<number | null>(null);
  
  const [approveData, setApproveData] = useState({ sectorId: '', gate: '' });
  const [rejectNotes, setRejectNotes] = useState('');

  const fetchAccreditations = () => {
    setLoading(true);
    pressService.getAdmin(filterMatchId ? parseInt(filterMatchId) : undefined, filterStatus !== 'Todos' ? filterStatus : undefined)
      .then(data => setAccreditations(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/matches').then(r => setMatches(r.data || [])).catch(console.error);
    stadiumService.getSectors().then(data => setSectors(data)).catch(console.error);
  }, []);

  useEffect(() => {
    fetchAccreditations();
  }, [filterMatchId, filterStatus]);

  const handleApprove = async (id: number) => {
    try {
      await pressService.approve(id, parseInt(approveData.sectorId), approveData.gate);
      setApproveModal(null);
      fetchAccreditations();
    } catch (err) {
      alert('Error al aprobar');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await pressService.reject(id, rejectNotes);
      setRejectModal(null);
      setRejectNotes('');
      fetchAccreditations();
    } catch (err) {
      alert('Error al rechazar');
    }
  };

  const handleRevoke = async (id: number) => {
    if (!window.confirm('¿Seguro que querés revocar esta credencial?')) return;
    try {
      await pressService.revoke(id);
      fetchAccreditations();
    } catch (err) {
      alert('Error al revocar');
    }
  };

  const stats = {
    pending: accreditations.filter(a => a.status === 'PENDING').length,
    approved: accreditations.filter(a => a.status === 'APPROVED').length,
    rejected: accreditations.filter(a => a.status === 'REJECTED').length
  };

  const styles: Record<string, React.CSSProperties> = {
    container: { padding: 20, maxWidth: 1200, margin: '0 auto', fontFamily: 'sans-serif' },
    filtersRow: { display: 'flex', gap: 15, marginBottom: 20, flexWrap: 'wrap' as any },
    select: { padding: '8px 12px', borderRadius: 4, border: `1px solid ${theme.colors.border}` },
    pill: { padding: '8px 16px', borderRadius: 20, border: `1px solid ${theme.colors.border}`, background: theme.colors.surface, cursor: 'pointer' },
    activePill: { background: theme.colors.primary, color: '#fff', borderColor: theme.colors.primary },
    statsRow: { display: 'flex', gap: 15, marginBottom: 20 },
    statCard: { flex: 1, padding: 15, background: theme.colors.surface, borderRadius: 8, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    table: { width: '100%', borderCollapse: 'collapse', background: theme.colors.surface, borderRadius: 8, overflow: 'hidden' },
    th: { padding: 12, textAlign: 'left', background: theme.colors.primary, color: '#fff' },
    td: { padding: 12, borderBottom: `1px solid ${theme.colors.border}`, verticalAlign: 'top' },
    btnGroup: { display: 'flex', gap: 5 },
    btnApprove: { background: theme.colors.success, color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' },
    btnReject: { background: theme.colors.error, color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' },
    btnRevoke: { background: '#6b7280', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' },
    modal: { padding: 15, background: '#f8fafc', border: `1px solid ${theme.colors.border}`, borderRadius: 8, marginTop: 10 }
  };

  return (
    <div style={styles.container}>
      <h1>Gestión de Prensa</h1>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={{ color: theme.colors.textMuted }}>Pendientes</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>{stats.pending}</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ color: theme.colors.textMuted }}>Aprobadas</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.colors.success }}>{stats.approved}</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ color: theme.colors.textMuted }}>Rechazadas</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.colors.error }}>{stats.rejected}</div>
        </div>
      </div>

      <div style={styles.filtersRow}>
        <select style={styles.select} value={filterMatchId} onChange={e => setFilterMatchId(e.target.value)}>
          <option value="">Todos los partidos</option>
          {matches.map(m => <option key={m.id} value={m.id}>{m.title || `Partido ${m.id}`}</option>)}
        </select>

        {['Todos', 'PENDING', 'APPROVED', 'REJECTED', 'REVOKED'].map(f => (
          <button key={f} style={{...styles.pill, ...(filterStatus === f ? styles.activePill : {})}} onClick={() => setFilterStatus(f)}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Cargando solicitudes...</div>
      ) : accreditations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, background: theme.colors.surface, borderRadius: 8 }}>No hay solicitudes.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Periodista / Medio</th>
                <th style={styles.th}>Rol / Cobertura</th>
                <th style={styles.th}>Contacto</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {accreditations.map(acc => (
                <tr key={acc.id}>
                  <td style={styles.td}>
                    <strong>{acc.journalistName}</strong><br/>
                    {acc.mediaName}
                  </td>
                  <td style={styles.td}>
                    {acc.role}<br/>
                    <span style={{ fontSize: '0.85rem', color: theme.colors.textMuted }}>{acc.coverageType}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontSize: '0.85rem' }}>{acc.email}</div>
                    <div style={{ fontSize: '0.85rem' }}>{acc.phone}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ padding: '4px 8px', borderRadius: 12, fontSize: '0.8rem', background: acc.status === 'APPROVED' ? theme.colors.success : acc.status === 'PENDING' ? '#f59e0b' : theme.colors.textMuted, color: '#fff' }}>
                      {acc.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {acc.status === 'PENDING' && (
                      <div style={styles.btnGroup}>
                        <button style={styles.btnApprove} onClick={() => { setApproveModal(acc.id); setRejectModal(null); }}>✅ Aprobar</button>
                        <button style={styles.btnReject} onClick={() => { setRejectModal(acc.id); setApproveModal(null); }}>❌ Rechazar</button>
                      </div>
                    )}
                    {acc.status === 'APPROVED' && (
                      <button style={styles.btnRevoke} onClick={() => handleRevoke(acc.id)}>🔴 Revocar</button>
                    )}

                    {approveModal === acc.id && (
                      <div style={styles.modal}>
                        <div style={{ marginBottom: 10 }}>
                          <label style={{ display: 'block', fontSize: '0.85rem' }}>Sector Asignado</label>
                          <select style={{ ...styles.select, width: '100%' }} value={approveData.sectorId} onChange={e => setApproveData({...approveData, sectorId: e.target.value})}>
                            <option value="">Seleccionar sector...</option>
                            {sectors.map(s => <option key={s.id} value={s.id}>{s.name} ({s.type})</option>)}
                          </select>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <label style={{ display: 'block', fontSize: '0.85rem' }}>Puerta de Ingreso</label>
                          <input style={{ ...styles.select, width: '100%', boxSizing: 'border-box' }} value={approveData.gate} onChange={e => setApproveData({...approveData, gate: e.target.value})} placeholder="Ej: Puerta 3" />
                        </div>
                        <div style={styles.btnGroup}>
                          <button style={styles.btnApprove} onClick={() => handleApprove(acc.id)}>Confirmar</button>
                          <button style={{ ...styles.btnReject, background: 'none', color: theme.colors.text, border: '1px solid #ccc' }} onClick={() => setApproveModal(null)}>Cancelar</button>
                        </div>
                      </div>
                    )}

                    {rejectModal === acc.id && (
                      <div style={styles.modal}>
                        <div style={{ marginBottom: 10 }}>
                          <label style={{ display: 'block', fontSize: '0.85rem' }}>Motivo (Opcional)</label>
                          <textarea style={{ width: '100%', padding: 8, boxSizing: 'border-box' }} rows={2} value={rejectNotes} onChange={e => setRejectNotes(e.target.value)} />
                        </div>
                        <div style={styles.btnGroup}>
                          <button style={styles.btnReject} onClick={() => handleReject(acc.id)}>Confirmar Rechazo</button>
                          <button style={{ ...styles.btnApprove, background: 'none', color: theme.colors.text, border: '1px solid #ccc' }} onClick={() => setRejectModal(null)}>Cancelar</button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
