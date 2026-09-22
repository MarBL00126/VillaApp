import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { cantinaService } from '../services/cantinaService';

interface LocalCartItem {
  menuItemId: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

export function CantinaCartScreen() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<LocalCartItem[]>(() => {
    const saved = localStorage.getItem('cantina_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem('cantina_cart', JSON.stringify(cart));
  }, [cart]);

  const updateQuantity = (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(i => i.menuItemId === itemId ? { ...i, quantity: newQty } : i));
  };

  const removeItem = (itemId: number) => {
    setCart(prev => prev.filter(i => i.menuItemId !== itemId));
  };

  const submitOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const orderData = {
        items: cart.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        paymentMethod,
        notes
      };
      const res = await cantinaService.createOrder(orderData);
      localStorage.removeItem('cantina_cart'); // Clear cart
      navigate(`/cantina/orders/${res.orderNumber}`);
    } catch (e) {
      alert('Error al crear el pedido. Por favor intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  const total = cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

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
    },
    backBtn: {
      background: 'none',
      border: 'none',
      color: theme.colors.primary,
      fontSize: theme.fontSizes.lg,
      cursor: 'pointer',
      marginRight: '15px',
    },
    title: { margin: 0, fontSize: theme.fontSizes.xl },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      padding: '15px',
      borderRadius: theme.borderRadius.md,
      marginBottom: '10px',
      boxShadow: theme.shadows.card,
    },
    itemInfo: { flex: 1 },
    itemName: { margin: '0 0 5px 0', fontWeight: 'bold' },
    itemPrice: { color: theme.colors.primary, margin: 0 },
    controls: { display: 'flex', alignItems: 'center', gap: '10px' },
    btn: {
      padding: '5px 10px',
      cursor: 'pointer',
      borderRadius: theme.borderRadius.sm,
      border: `1px solid ${theme.colors.border}`,
      background: theme.colors.surface,
    },
    deleteBtn: {
      color: theme.colors.error,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    },
    section: {
      backgroundColor: theme.colors.surface,
      padding: '20px',
      borderRadius: theme.borderRadius.md,
      marginTop: '20px',
      boxShadow: theme.shadows.card,
    },
    sectionTitle: {
      margin: '0 0 15px 0',
      fontSize: theme.fontSizes.md,
    },
    radioLabel: {
      display: 'block',
      marginBottom: '10px',
      cursor: 'pointer',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      borderRadius: theme.borderRadius.sm,
      border: `1px solid ${theme.colors.border}`,
      boxSizing: 'border-box',
      minHeight: '80px',
      fontFamily: 'inherit',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    confirmBtn: {
      width: '100%',
      padding: '15px',
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      border: 'none',
      borderRadius: theme.borderRadius.md,
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      marginTop: '20px',
      cursor: 'pointer',
    }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/cantina/menu')}>←</button>
          <h1 style={styles.title}>Tu pedido</h1>
        </div>
        <p>No tienes artículos en tu pedido.</p>
        <button style={styles.confirmBtn} onClick={() => navigate('/cantina/menu')}>Ver menú</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/cantina/menu')}>←</button>
        <h1 style={styles.title}>Tu pedido</h1>
      </div>

      <div>
        {cart.map(item => (
          <div key={item.menuItemId} style={styles.item}>
            <div style={styles.itemInfo}>
              <h4 style={styles.itemName}>{item.name}</h4>
              <p style={styles.itemPrice}>${item.unitPrice.toLocaleString('es-AR')}</p>
            </div>
            <div style={styles.controls}>
              <button style={styles.btn} onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button style={styles.btn} onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}>+</button>
              <button style={styles.deleteBtn} onClick={() => removeItem(item.menuItemId)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Método de pago</h3>
        {['Efectivo', 'MercadoPago', 'Transferencia'].map(m => (
          <label key={m} style={styles.radioLabel}>
            <input 
              type="radio" 
              name="payment" 
              value={m} 
              checked={paymentMethod === m} 
              onChange={e => setPaymentMethod(e.target.value)} 
            /> {m}
          </label>
        ))}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Notas (Opcional)</h3>
        <textarea 
          style={styles.textarea} 
          placeholder="Ej: Sin mayonesa, etc." 
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      <div style={styles.section}>
        <div style={styles.totalRow}>
          <span>Total a pagar</span>
          <span>${total.toLocaleString('es-AR')}</span>
        </div>
      </div>

      <button 
        style={{ ...styles.confirmBtn, opacity: isSubmitting ? 0.7 : 1 }} 
        onClick={submitOrder}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Procesando...' : 'Confirmar pedido'}
      </button>
    </div>
  );
}
