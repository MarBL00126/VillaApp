import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { cantinaService } from '../services/cantinaService';
import type { CantinaInfo } from '../types';

export function CantinaScreen() {
  const navigate = useNavigate();
  const [info, setInfo] = useState<CantinaInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cantinaService.getInfo()
      .then(setInfo)
      .finally(() => setLoading(false));
  }, []);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    hero: {
      background: `linear-gradient(135deg, ${theme.colors.primary}, #060f26)`,
      padding: '50px 20px',
      color: theme.colors.white,
      textAlign: 'center',
    },
    heroIcon: {
      fontSize: '48px',
      margin: '0 0 10px 0',
    },
    title: {
      margin: 0,
      fontSize: '2rem',
    },
    statusBanner: {
      padding: '15px',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: theme.fontSizes.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      backgroundColor: info?.isOpen ? '#d1fae5' : '#fee2e2',
      color: info?.isOpen ? '#065f46' : '#991b1b',
    },
    pulse: {
      display: 'inline-block',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: info?.isOpen ? '#10b981' : '#ef4444',
      animation: 'pulse 2s infinite',
    },
    content: {
      padding: '20px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px',
      marginBottom: '30px',
    },
    card: {
      backgroundColor: theme.colors.surface,
      padding: '20px',
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.card,
      textAlign: 'center',
    },
    cardIcon: {
      fontSize: '24px',
      marginBottom: '10px',
    },
    cardTitle: {
      margin: '0 0 5px 0',
      color: theme.colors.primary,
      fontSize: theme.fontSizes.md,
    },
    cardText: {
      margin: 0,
      color: theme.colors.textMuted,
      fontSize: theme.fontSizes.sm,
    },
    link: {
      color: theme.colors.secondary,
      textDecoration: 'none',
      fontWeight: 'bold',
      display: 'block',
      marginTop: '5px',
    },
    actions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    primaryBtn: {
      padding: '15px',
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      border: 'none',
      borderRadius: theme.borderRadius.md,
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      cursor: 'pointer',
      textAlign: 'center',
    },
    secondaryBtn: {
      padding: '15px',
      backgroundColor: theme.colors.surface,
      color: theme.colors.primary,
      border: `2px solid ${theme.colors.primary}`,
      borderRadius: theme.borderRadius.md,
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      cursor: 'pointer',
      textAlign: 'center',
    }
  };

  // Inject keyframes for pulse animation if not exists
  useEffect(() => {
    if (!document.getElementById('cantina-styles')) {
      const style = document.createElement('style');
      style.id = 'cantina-styles';
      style.innerHTML = `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (loading) return <div style={styles.container}>Cargando...</div>;
  if (!info) return <div style={styles.container}>Error al cargar info de la cantina.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroIcon}>🍽</div>
        <h1 style={styles.title}>Cantina del Club</h1>
      </div>

      <div style={styles.statusBanner}>
        <span style={styles.pulse}></span>
        {info.isOpen ? 'ABIERTA' : 'CERRADA'}
      </div>

      <div style={styles.content}>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardIcon}>📍</div>
            <h3 style={styles.cardTitle}>Ubicación</h3>
            <p style={styles.cardText}>{info.address}</p>
            <a href={info.mapsUrl} target="_blank" rel="noreferrer" style={styles.link}>Ver en mapa</a>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>🕐</div>
            <h3 style={styles.cardTitle}>Horarios</h3>
            <p style={styles.cardText}>{info.schedule}</p>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>💳</div>
            <h3 style={styles.cardTitle}>Pagos</h3>
            <p style={styles.cardText}>{info.paymentMethods}</p>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>📞</div>
            <h3 style={styles.cardTitle}>Contacto</h3>
            <p style={styles.cardText}>{info.phone}</p>
            <p style={styles.cardText}>{info.email}</p>
          </div>
        </div>

        <div style={styles.actions}>
          <button style={styles.primaryBtn} onClick={() => navigate('/cantina/menu')}>
            Ver menú
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate('/cantina/menu')}>
            Hacer un pedido
          </button>
          <button style={styles.secondaryBtn} onClick={() => window.open(info.mapsUrl, '_blank')}>
            Cómo llegar
          </button>
        </div>
      </div>
    </div>
  );
}
