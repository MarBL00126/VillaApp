import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pressService } from '../services/stadiumService';
import { theme } from '../theme';

export function MyAccreditationsScreen() {
  const navigate = useNavigate();
  const [accreditations, setAccreditations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pressService.getMy()
      .then(data => setAccreditations(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'PENDING': return { bg: '#fef3c7', color: '#d97706' };
      case 'APPROVED': return { bg: '#dcfce7', color: '#16a34a' };
      case 'REJECTED': return { bg: '#fee2e2', color: '#dc2626' };
      case 'REVOKED': return { bg: '#f3f4f6', color: '#4b5563' };
      default: return { bg: '#f3f4f6', color: '#4b5563' };
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'PENDING': return 'Pendiente';
      case 'APPROVED': return 'Aprobada';
      case 'REJECTED': return 'Rechazada';
      case 'REVOKED': return 'Revocada';
      default: return status;
    }
  };

  const styles: Record<string, React.CSSProperties> = {
    container: { padding: 20, maxWidth: 800, margin: '0 auto', fontFamily: 'sans-serif' },
    header: { marginBottom: 30 },
    card: { background: theme.colors.surface, padding: 20, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 15, border: `1px solid ${theme.colors.border}` },
    badge: { display: 'inline-block', padding: '4px 10px', borderRadius: 12, fontSize: '0.8rem', fontWeight: 'bold' },
    btnPrimary: { display: 'inline-block', padding: '8px 16px', background: theme.colors.primary, color: '#fff', textDecoration: 'none', borderRadius: 4, marginTop: 10, cursor: 'pointer', border: 'none' },
    emptyState: { textAlign: 'center', padding: 40, background: theme.colors.surface, borderRadius: 8, border: `1px dashed ${theme.colors.border}` }
  };

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ margin: 0 }}>Mis Acreditaciones</h1>
      </div>

      {accreditations.length === 0 ? (
        <div style={styles.emptyState}>
          <h3>No tenés acreditaciones solicitadas.</h3>
          <p style={{ color: theme.colors.textMuted, marginBottom: 20 }}>¿Querés solicitar una acreditación de prensa para el próximo partido?</p>
          <button style={styles.btnPrimary} onClick={() => navigate('/press/request')}>Solicitar Acreditación</button>
        </div>
      ) : (
        accreditations.map(acc => {
          const statusStyle = getStatusStyle(acc.status);
          return (
            <div key={acc.id} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <h3 style={{ margin: 0 }}>{acc.matchTitle || 'Temporada Completa'}</h3>
                <span style={{ ...styles.badge, background: statusStyle.bg, color: statusStyle.color }}>
                  {getStatusText(acc.status)}
                </span>
              </div>
              <div style={{ color: theme.colors.textMuted, fontSize: '0.9rem', marginBottom: 15 }}>
                <div><strong>Medio:</strong> {acc.mediaName}</div>
                <div><strong>Rol:</strong> {acc.role} - {acc.coverageType}</div>
              </div>

              {acc.status === 'APPROVED' && (
                <button style={styles.btnPrimary} onClick={() => navigate(`/press/${acc.id}/card`)}>
                  Ver credencial
                </button>
              )}
              {acc.status === 'PENDING' && (
                <div style={{ color: '#d97706', fontSize: '0.9rem' }}>Pendiente de revisión por el club.</div>
              )}
              {acc.status === 'REJECTED' && acc.notes && (
                <div style={{ color: theme.colors.error, fontSize: '0.9rem', background: '#fee2e2', padding: 10, borderRadius: 4 }}>
                  <strong>Motivo de rechazo:</strong> {acc.notes}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
