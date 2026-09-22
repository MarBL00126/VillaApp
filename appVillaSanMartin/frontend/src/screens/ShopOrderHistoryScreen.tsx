import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { shopService } from '../services/shopService';
import type { ShopOrder } from '../types';

export function ShopOrderHistoryScreen() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shopService.getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '20px',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    header: {
      fontSize: theme.fontSizes.xl,
      color: theme.colors.primary,
      marginBottom: '20px',
    },
    card: {
      backgroundColor: theme.colors.surface,
      padding: '15px',
      borderRadius: theme.borderRadius.md,
      marginBottom: '15px',
      boxShadow: theme.shadows.card,
      cursor: 'pointer',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
    },
    date: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSizes.sm,
    },
    total: {
      fontWeight: 'bold',
      fontSize: theme.fontSizes.lg,
    }
  };

  const getStatusBadge = (status: string) => {
    const badgeStyle: React.CSSProperties = {
      padding: '4px 8px',
      borderRadius: theme.borderRadius.full,
      fontSize: theme.fontSizes.xs,
      fontWeight: 'bold',
    };
    if (status === 'PENDING_PAYMENT') return <span style={{ ...badgeStyle, background: '#fef3c7', color: '#92400e' }}>Pendiente</span>;
    if (status === 'PAID') return <span style={{ ...badgeStyle, background: '#d1fae5', color: '#065f46' }}>Pagado</span>;
    if (status === 'CANCELLED') return <span style={{ ...badgeStyle, background: '#fee2e2', color: '#991b1b' }}>Cancelado</span>;
    return <span style={badgeStyle}>{status}</span>;
  };

  if (loading) return <div style={styles.container}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Mis pedidos</h1>
      {orders.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        orders.map(o => (
          <div key={o.id} style={styles.card} onClick={() => navigate(`/shop/orders/${o.id}`)}>
            <div style={styles.row}>
              <strong>Pedido #{o.id}</strong>
              {getStatusBadge(o.status)}
            </div>
            <div style={styles.row}>
              <span style={styles.date}>{new Date(o.createdAt).toLocaleDateString('es-AR')}</span>
              <span style={styles.total}>${o.totalAmount.toLocaleString('es-AR')}</span>
            </div>
            <div style={styles.date}>{o.items.length} artículos</div>
          </div>
        ))
      )}
    </div>
  );
}
