import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { shopService } from '../services/shopService';
import type { Cart } from '../types';

export function CartScreen() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await shopService.getCart();
      setCart(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    await shopService.updateCartItem(itemId, newQty);
    fetchCart();
  };

  const removeItem = async (itemId: number) => {
    await shopService.removeCartItem(itemId);
    fetchCart();
  };

  const applyCoupon = async () => {
    if (!coupon) return;
    try {
      const res = await shopService.validateCoupon(coupon, subtotal);
      setDiscount(res.discountAmount || (subtotal * res.discountPct / 100));
      alert('Cupón aplicado');
    } catch (e) {
      alert('Cupón inválido');
    }
  };

  const handleCheckout = async () => {
    try {
      const order = await shopService.createOrder(coupon);
      await shopService.payOrder(order.id);
      // Simulating MP redirect
      alert('Redirigiendo a MercadoPago...');
      navigate(`/shop/orders/${order.id}`);
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
    header: {
      fontSize: theme.fontSizes.xl,
      color: theme.colors.primary,
      marginBottom: '20px',
    },
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
    itemPrice: { color: theme.colors.secondary, margin: 0 },
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
    summary: {
      backgroundColor: theme.colors.surface,
      padding: '20px',
      borderRadius: theme.borderRadius.md,
      marginTop: '20px',
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '10px 0',
    },
    total: {
      fontSize: theme.fontSizes.title,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    checkoutBtn: {
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
    },
    couponArea: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
    },
    input: {
      flex: 1,
      padding: '10px',
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.border}`,
    },
    applyBtn: {
      padding: '10px 20px',
      backgroundColor: theme.colors.secondary,
      color: theme.colors.white,
      border: 'none',
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
    }
  };

  if (loading) return <div style={styles.container}>Cargando carrito...</div>;

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
  const total = subtotal - discount;

  if (items.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Mi carrito</h1>
        <p>Tu carrito está vacío.</p>
        <button style={styles.checkoutBtn} onClick={() => navigate('/shop')}>Ir a la tienda</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Mi carrito</h1>
      {items.map(item => (
        <div key={item.id} style={styles.item}>
          <div style={styles.itemInfo}>
            <h4 style={styles.itemName}>{item.product.name} {item.variant ? `(${item.variant.label})` : ''}</h4>
            <p style={styles.itemPrice}>${item.unitPrice.toLocaleString('es-AR')}</p>
          </div>
          <div style={styles.controls}>
            <button style={styles.btn} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button style={styles.btn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            <button style={styles.deleteBtn} onClick={() => removeItem(item.id)}>🗑️</button>
          </div>
        </div>
      ))}

      <div style={styles.couponArea}>
        <input
          style={styles.input}
          placeholder="Código de descuento"
          value={coupon}
          onChange={e => setCoupon(e.target.value)}
        />
        <button style={styles.applyBtn} onClick={applyCoupon}>Aplicar</button>
      </div>

      <div style={styles.summary}>
        <div style={styles.row}>
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString('es-AR')}</span>
        </div>
        {discount > 0 && (
          <div style={{ ...styles.row, color: theme.colors.success }}>
            <span>Descuento</span>
            <span>-${discount.toLocaleString('es-AR')}</span>
          </div>
        )}
        <div style={styles.row}>
          <span style={styles.total}>Total</span>
          <span style={styles.total}>${total.toLocaleString('es-AR')}</span>
        </div>
      </div>

      <button style={styles.checkoutBtn} onClick={handleCheckout}>
        Ir a pagar
      </button>
    </div>
  );
}
