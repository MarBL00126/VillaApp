import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { cantinaService } from '../services/cantinaService';
import type { CantinaOrder } from '../types';

export function CantinaOrderStatusScreen() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<CantinaOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (orderNumber) {
      cantinaService.trackOrder(orderNumber)
        .then(setOrder)
        .finally(() => setLoading(false));
    }
  }, [orderNumber, refreshKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(k => k + 1);
    }, 15000); // Auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '20px',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      justifyContent: 'space-between',
    },
    backBtn: {
      background: 'none',
      border: 'none',
      color: theme.colors.primary,
      fontSize: theme.fontSizes.lg,
      cursor: 'pointer',
    },
    title: { margin: 0, fontSize: theme.fontSizes.xl },
    refreshBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '20px',
    },
    orderNumberBox: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      padding: '20px',
      borderRadius: theme.borderRadius.md,
      textAlign: 'center',
      marginBottom: '20px',
    },
    orderNumberText: {
      margin: '0 0 5px 0',
      fontSize: theme.fontSizes.sm,
      opacity: 0.8,
    },
    orderNumberVal: {
      margin: 0,
      fontSize: '2rem',
      fontWeight: 'bold',
      letterSpacing: '2px',
    },
    timeline: {
      backgroundColor: theme.colors.surface,
      padding: '30px 20px',
      borderRadius: theme.borderRadius.md,
      marginBottom: '20px',
      boxShadow: theme.shadows.card,
    },
    timelineSteps: {
      display: 'flex',
      justifyContent: 'space-between',
      position: 'relative',
    },
    timelineLine: {
      position: 'absolute',
      top: '15px',
      left: '10%',
      right: '10%',
      height: '3px',
      backgroundColor: theme.colors.border,
      zIndex: 1,
    },
    timelineLineProgress: {
      position: 'absolute',
      top: '15px',
      left: '10%',
      height: '3px',
      backgroundColor: theme.colors.success,
      zIndex: 2,
      transition: 'width 0.5s ease',
    },
    step: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 3,
      position: 'relative',
      width: '25%',
    },
    circle: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      backgroundColor: theme.colors.surface,
      border: `3px solid ${theme.colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '10px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    activeCircle: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
    },
    successCircle: {
      borderColor: theme.colors.success,
      backgroundColor: theme.colors.success,
      color: theme.colors.white,
    },
    stepLabel: {
      fontSize: '10px',
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.colors.textMuted,
    },
    activeLabel: {
      color: theme.colors.text,
    },
    readyBanner: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      padding: '20px',
      borderRadius: theme.borderRadius.md,
      textAlign: 'center',
      marginBottom: '20px',
      fontWeight: 'bold',
      fontSize: theme.fontSizes.lg,
      border: '2px solid #059669',
      boxShadow: theme.shadows.elevated,
    },
    detailsBox: {
      backgroundColor: theme.colors.surface,
      padding: '20px',
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.card,
    },
    itemRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      paddingBottom: '10px',
      borderBottom: `1px solid ${theme.colors.border}`,
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 'bold',
      fontSize: theme.fontSizes.lg,
      marginTop: '15px',
      color: theme.colors.primary,
    }
  };

  const statusMap = ['PENDING', 'PREPARING', 'READY', 'DELIVERED'];
  
  if (loading && !order) return <div style={styles.container}>Cargando...</div>;
  if (!order) return <div style={styles.container}>Pedido no encontrado</div>;

  const currentIndex = statusMap.indexOf(order.status);
  const progressPercent = currentIndex <= 0 ? 0 : currentIndex >= 3 ? 100 : (currentIndex / 3) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/cantina')}>← Inicio</button>
        <h1 style={styles.title}>Estado</h1>
        <button style={styles.refreshBtn} onClick={() => setRefreshKey(k => k + 1)}>🔄</button>
      </div>

      {order.status === 'READY' && (
        <div style={styles.readyBanner}>
          🎉 ¡Tu pedido está listo! 🎉<br/>
          <span style={{ fontSize: theme.fontSizes.md, fontWeight: 'normal' }}>Acercate a la cantina para retirarlo.</span>
        </div>
      )}

      <div style={styles.orderNumberBox}>
        <p style={styles.orderNumberText}>NÚMERO DE PEDIDO</p>
        <p style={styles.orderNumberVal}>{order.orderNumber}</p>
      </div>

      <div style={styles.timeline}>
        <div style={styles.timelineSteps}>
          <div style={styles.timelineLine}></div>
          <div style={{ ...styles.timelineLineProgress, width: `${progressPercent}%` }}></div>
          
          <div style={styles.step}>
            <div style={{ ...styles.circle, ...(currentIndex >= 0 ? styles.successCircle : {}) }}>{currentIndex > 0 ? '✓' : '1'}</div>
            <div style={{ ...styles.stepLabel, ...(currentIndex >= 0 ? styles.activeLabel : {}) }}>Pendiente</div>
          </div>
          <div style={styles.step}>
            <div style={{ ...styles.circle, ...(currentIndex >= 1 ? (currentIndex > 1 ? styles.successCircle : styles.activeCircle) : {}) }}>
              {currentIndex > 1 ? '✓' : '2'}
            </div>
            <div style={{ ...styles.stepLabel, ...(currentIndex >= 1 ? styles.activeLabel : {}) }}>Preparando</div>
          </div>
          <div style={styles.step}>
            <div style={{ ...styles.circle, ...(currentIndex >= 2 ? (currentIndex > 2 ? styles.successCircle : styles.activeCircle) : {}) }}>
              {currentIndex > 2 ? '✓' : '3'}
            </div>
            <div style={{ ...styles.stepLabel, ...(currentIndex >= 2 ? styles.activeLabel : {}) }}>Listo</div>
          </div>
          <div style={styles.step}>
            <div style={{ ...styles.circle, ...(currentIndex >= 3 ? styles.successCircle : {}) }}>
              {currentIndex >= 3 ? '✓' : '4'}
            </div>
            <div style={{ ...styles.stepLabel, ...(currentIndex >= 3 ? styles.activeLabel : {}) }}>Entregado</div>
          </div>
        </div>
        {order.status === 'PENDING' && <p style={{ textAlign: 'center', marginTop: '20px', color: theme.colors.textMuted }}>Tiempo estimado: 15-20 min</p>}
      </div>

      <div style={styles.detailsBox}>
        <h3 style={{ margin: '0 0 15px 0' }}>Detalle</h3>
        {order.items.map(item => (
          <div key={item.id} style={styles.itemRow}>
            <span>{item.quantity}x {item.menuItem.name}</span>
            <span>${(item.quantity * item.unitPrice).toLocaleString('es-AR')}</span>
          </div>
        ))}
        <div style={styles.totalRow}>
          <span>Total ({order.paymentMethod})</span>
          <span>${order.totalAmount.toLocaleString('es-AR')}</span>
        </div>
      </div>
    </div>
  );
}
