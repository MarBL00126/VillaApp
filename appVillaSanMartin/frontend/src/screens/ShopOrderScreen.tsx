import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { shopService } from '../services/shopService';
import type { ShopOrder } from '../types';

export function ShopOrderScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<ShopOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      shopService.getOrder(Number(id))
        .then(setOrder)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePay = async () => {
    if (!order) return;
    try {
      await shopService.payOrder(order.id);
      alert('Redirigiendo a MercadoPago...');
      // Reload order state after payment in a real app, here we simulate redirect
    } catch (e) {
      alert('Error procesando pago');
    }
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '20px',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    backBtn: {
      background: 'none',
      border: 'none',
      color: theme.colors.primary,
      fontSize: theme.fontSizes.lg,
      cursor: 'pointer',
      marginBottom: '20px',
    },
    card: {
      backgroundColor: theme.colors.surface,
      padding: '20px',
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.card,
    },
    title: {
      margin: '0 0 10px 0',
      fontSize: theme.fontSizes.xl,
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '10px 0',
      paddingBottom: '10px',
      borderBottom: `1px solid ${theme.colors.border}`,
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '10px 0',
      fontWeight: 'bold',
      fontSize: theme.fontSizes.lg,
      color: theme.colors.primary,
    },
    payBtn: {
      width: '100%',
      padding: '15px',
      backgroundColor: theme.colors.secondary,
      color: theme.colors.white,
      border: 'none',
      borderRadius: theme.borderRadius.md,
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      marginTop: '20px',
      cursor: 'pointer',
    },
    successBanner: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      padding: '15px',
      borderRadius: theme.borderRadius.md,
      marginTop: '20px',
      textAlign: 'center',
      fontWeight: 'bold',
    }
  };

  const getStatusBadge = (status: string) => {
    const badgeStyle: React.CSSProperties = {
      padding: '4px 8px',
      borderRadius: theme.borderRadius.full,
      fontSize: theme.fontSizes.xs,
      fontWeight: 'bold',
    };
    if (status === 'PENDING_PAYMENT') return <span style={{ ...badgeStyle, background: '#fef3c7', color: '#92400e' }}>Pendiente de Pago</span>;
    if (status === 'PAID') return <span style={{ ...badgeStyle, background: '#d1fae5', color: '#065f46' }}>Pagado</span>;
    if (status === 'CANCELLED') return <span style={{ ...badgeStyle, background: '#fee2e2', color: '#991b1b' }}>Cancelado</span>;
    return <span style={badgeStyle}>{status}</span>;
  };

  if (loading) return <div style={styles.container}>Cargando...</div>;
  if (!order) return <div style={styles.container}>Pedido no encontrado</div>;

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
      
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={styles.title}>Pedido #{order.id}</h2>
          {getStatusBadge(order.status)}
        </div>
        <p style={{ color: theme.colors.textMuted }}>Fecha: {new Date(order.createdAt).toLocaleDateString('es-AR')}</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Artículos</h3>
          {order.items.map(item => (
            <div key={item.id} style={styles.row}>
              <span>{item.quantity}x {item.product.name} {item.variant ? `(${item.variant.label})` : ''}</span>
              <span>${(item.unitPrice * item.quantity).toLocaleString('es-AR')}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px' }}>
          <div style={styles.row}>
            <span>Subtotal</span>
            <span>${order.subtotal.toLocaleString('es-AR')}</span>
          </div>
          {order.discount > 0 && (
            <div style={{ ...styles.row, color: theme.colors.success }}>
              <span>Descuento</span>
              <span>-${order.discount.toLocaleString('es-AR')}</span>
            </div>
          )}
          <div style={styles.totalRow}>
            <span>Total</span>
            <span>${order.totalAmount.toLocaleString('es-AR')}</span>
          </div>
        </div>

        {order.status === 'PENDING_PAYMENT' && (
          <button style={styles.payBtn} onClick={handlePay}>Pagar ahora</button>
        )}
        {order.status === 'PAID' && (
          <div style={styles.successBanner}>¡Pago completado con éxito!</div>
        )}
      </div>
    </div>
  );
}
