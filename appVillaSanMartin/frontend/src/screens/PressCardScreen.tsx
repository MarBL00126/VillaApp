import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { pressService } from '../services/stadiumService';
import { theme } from '../theme';

export function PressCardScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    pressService.getCard(parseInt(id))
      .then(data => setCard(data))
      .catch(err => setError(err.response?.data?.message || 'Error al cargar credencial'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado al portapapeles');
  };

  const styles: Record<string, React.CSSProperties> = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', minHeight: '100vh', background: theme.colors.background },
    credential: { width: '100%', maxWidth: 400, background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative' as any },
    header: { background: theme.colors.primary, padding: '30px 20px', color: '#fff', textAlign: 'center', borderBottom: `5px solid ${theme.colors.error}` },
    badge: { display: 'inline-block', background: theme.colors.error, color: '#fff', padding: '5px 15px', borderRadius: 20, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10 },
    body: { padding: 30, textAlign: 'center' },
    name: { fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 5px 0', color: theme.colors.text },
    media: { fontSize: '1.2rem', color: theme.colors.textMuted, margin: '0 0 20px 0' },
    detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: '#f8fafc', padding: 15, borderRadius: 8, marginBottom: 20 },
    qrContainer: { padding: 20, background: '#fff', border: '2px solid #f1f5f9', borderRadius: 12, display: 'inline-block' },
    footer: { background: '#f8fafc', padding: 15, textAlign: 'center', fontSize: '0.8rem', color: theme.colors.textMuted },
    actions: { display: 'flex', gap: 15, marginTop: 30, width: '100%', maxWidth: 400 },
    btn: { flex: 1, padding: 12, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 'bold' }
  };

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Cargando credencial...</div>;
  if (error) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ color: theme.colors.error, marginBottom: 20 }}>{error}</div>
      <button onClick={() => navigate(-1)} style={{ padding: '8px 16px' }}>Volver</button>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.credential}>
        <div style={styles.header}>
          <div style={styles.badge}>PRENSA</div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>Club Villa San Martín</h2>
        </div>
        
        <div style={styles.body}>
          <h1 style={styles.name}>{card.journalistName}</h1>
          <h3 style={styles.media}>{card.mediaName}</h3>
          
          <div style={styles.detailsGrid}>
            <div>
              <div style={{ fontSize: '0.8rem', color: theme.colors.textMuted }}>SECTOR</div>
              <div style={{ fontWeight: 'bold' }}>{card.sector || '-'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: theme.colors.textMuted }}>PUERTA</div>
              <div style={{ fontWeight: 'bold' }}>{card.gate || '-'}</div>
            </div>
          </div>

          <div style={styles.qrContainer}>
            <QRCodeSVG value={card.qrCode || 'INVALID'} size={200} />
          </div>
        </div>

        <div style={styles.footer}>
          Válido desde: {new Date(card.validFrom).toLocaleDateString('es-AR')} <br />
          Hasta: {card.validUntil ? new Date(card.validUntil).toLocaleDateString('es-AR') : 'Fin de temporada'}
          <div style={{ marginTop: 10, fontWeight: 'bold' }}>Presentar esta credencial al ingresar.</div>
        </div>
      </div>

      <div style={styles.actions} className="no-print">
        <button style={{ ...styles.btn, background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }} onClick={handleShare}>Compartir</button>
        <button style={{ ...styles.btn, background: theme.colors.primary, color: '#fff' }} onClick={() => window.print()}>Imprimir</button>
      </div>
    </div>
  );
}
