import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { membershipService } from '../services/membershipService';
import { QRCodeSVG } from 'qrcode.react';

export function DigitalCardScreen() {
  const navigate = useNavigate();
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    membershipService.getCard()
      .then(res => setCard(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    if (card?.memberNumber) {
      navigator.clipboard.writeText(card.memberNumber);
      alert('¡Número de socio copiado!');
    }
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '20px',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      marginBottom: '30px',
    },
    backBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: theme.colors.text,
      padding: 0,
    },
    title: {
      margin: 0,
      color: theme.colors.primary,
      marginLeft: '15px',
    },
    cardWrapper: {
      width: '320px',
      height: '180px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #0d1f4e 0%, #1a3a6e 50%, #0d1f4e 100%)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      position: 'relative',
      overflow: 'hidden',
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginBottom: '40px',
    },
    goldStripe: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '6px',
      backgroundColor: theme.colors.secondary,
    },
    cardTop: {
      fontSize: '12px',
      color: theme.colors.secondary,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    cardMiddle: {
      marginTop: '10px',
    },
    memberName: {
      fontSize: '20px',
      fontWeight: 'bold',
      margin: 0,
    },
    memberNumber: {
      fontSize: '16px',
      color: theme.colors.secondary,
      margin: '5px 0 0 0',
      fontWeight: 'bold',
    },
    cardBottom: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      fontSize: '14px',
    },
    statusBadge: {
      backgroundColor: card?.status === 'ACTIVE' ? '#065f46' : '#991b1b',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    qrSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: theme.shadows.card,
      marginBottom: '20px',
    },
    tipText: {
      marginTop: '15px',
      textAlign: 'center',
      color: theme.colors.textMuted,
      fontSize: '14px',
      maxWidth: '250px',
    },
    copyBtn: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.primary,
      border: `1px solid ${theme.colors.border}`,
      padding: '10px 20px',
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      fontWeight: 'bold',
    }
  };

  if (loading) return <div style={styles.container}>Cargando carnet...</div>;
  if (!card) return <div style={styles.container}>Error al cargar el carnet.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <h2 style={styles.title}>Mi Carnet</h2>
      </div>

      <div style={styles.cardWrapper}>
        <div style={styles.goldStripe} />
        <div style={styles.cardTop}>🏀 Club Villa San Martín</div>
        <div style={styles.cardMiddle}>
          <p style={styles.memberName}>{card.fullName || 'Socio'}</p>
          <p style={styles.memberNumber}>N° {card.memberNumber}</p>
        </div>
        <div style={styles.cardBottom}>
          <span>{card.type?.name || 'Membresía'}</span>
          <span style={styles.statusBadge}>{card.status === 'ACTIVE' ? 'ACTIVO' : card.status}</span>
        </div>
      </div>

      {card.memberNumber && (
        <div style={styles.qrSection}>
          <QRCodeSVG value={card.memberNumber} size={180} level="H" bgColor="#ffffff" fgColor="#0d1f4e" />
          <p style={styles.tipText}>📱 Mostrá este QR en el estadio para validar tu membresía</p>
        </div>
      )}

      <button style={styles.copyBtn} onClick={handleCopy}>
        Copiar N° de Socio
      </button>
    </div>
  );
}
