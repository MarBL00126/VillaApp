import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { cantinaService } from '../services/cantinaService';
import type { CantinaMenuItem, CantinaMenuCategory } from '../types';

interface LocalCartItem {
  menuItemId: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

export function CantinaMenuScreen() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CantinaMenuCategory[]>([]);
  const [items, setItems] = useState<CantinaMenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [cart, setCart] = useState<LocalCartItem[]>(() => {
    const saved = localStorage.getItem('cantina_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cantina_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    Promise.all([
      cantinaService.getMenuCategories(),
      cantinaService.getMenu()
    ]).then(([cats, menuItems]) => {
      setCategories(cats);
      setItems(menuItems);
      if (cats.length > 0) setSelectedCategory(cats[0].id);
    }).finally(() => setLoading(false));
  }, []);

  const addToCart = (item: CantinaMenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItemId: item.id, name: item.name, quantity: 1, unitPrice: item.price }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.menuItemId === itemId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.menuItemId !== itemId);
    });
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  const filteredItems = items.filter(i => i.category.id === selectedCategory);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
      paddingBottom: '80px', // Space for floating cart
    },
    header: {
      padding: '15px 20px',
      backgroundColor: theme.colors.surface,
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.colors.border}`,
      position: 'sticky',
      top: 0,
      zIndex: 10,
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
    tabs: {
      display: 'flex',
      overflowX: 'auto',
      backgroundColor: theme.colors.surface,
      padding: '10px 20px',
      gap: '10px',
      position: 'sticky',
      top: '60px',
      zIndex: 9,
      borderBottom: `1px solid ${theme.colors.border}`,
    },
    pill: {
      padding: '8px 16px',
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    activePill: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      border: `1px solid ${theme.colors.primary}`,
    },
    menuList: {
      padding: '20px',
    },
    itemCard: {
      display: 'flex',
      backgroundColor: theme.colors.surface,
      padding: '15px',
      borderRadius: theme.borderRadius.md,
      marginBottom: '15px',
      boxShadow: theme.shadows.card,
    },
    itemImg: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: theme.borderRadius.sm,
      marginRight: '15px',
      backgroundColor: theme.colors.border,
    },
    itemInfo: {
      flex: 1,
    },
    itemName: { margin: '0 0 5px 0', fontSize: theme.fontSizes.md },
    itemDesc: { margin: '0 0 10px 0', fontSize: theme.fontSizes.sm, color: theme.colors.textMuted },
    itemPrice: { margin: 0, fontWeight: 'bold', color: theme.colors.primary },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    addBtn: {
      padding: '5px 15px',
      backgroundColor: theme.colors.secondary,
      color: theme.colors.white,
      border: 'none',
      borderRadius: theme.borderRadius.full,
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    qtyBtn: {
      width: '25px',
      height: '25px',
      borderRadius: '50%',
      backgroundColor: theme.colors.background,
      border: `1px solid ${theme.colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },
    floatingCart: {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      padding: '15px 20px',
      borderRadius: theme.borderRadius.full,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: theme.shadows.elevated,
      cursor: 'pointer',
      zIndex: 100,
    }
  };

  if (loading) return <div style={styles.container}>Cargando menú...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/cantina')}>←</button>
        <h1 style={styles.title}>Menú</h1>
      </div>

      <div style={styles.tabs}>
        {categories.map(cat => (
          <div
            key={cat.id}
            style={{ ...styles.pill, ...(selectedCategory === cat.id ? styles.activePill : {}) }}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </div>
        ))}
      </div>

      <div style={styles.menuList}>
        {filteredItems.length === 0 ? (
          <p>No hay artículos en esta categoría.</p>
        ) : (
          filteredItems.map(item => {
            const cartItem = cart.find(c => c.menuItemId === item.id);
            const qty = cartItem ? cartItem.quantity : 0;
            return (
              <div key={item.id} style={{ ...styles.itemCard, opacity: item.available ? 1 : 0.5 }}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} style={styles.itemImg} alt={item.name} />
                ) : (
                  <div style={styles.itemImg} />
                )}
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemDesc}>{item.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={styles.itemPrice}>${item.price.toLocaleString('es-AR')}</p>
                    {item.available ? (
                      qty > 0 ? (
                        <div style={styles.controls}>
                          <button style={styles.qtyBtn} onClick={() => removeFromCart(item.id)}>-</button>
                          <span>{qty}</span>
                          <button style={styles.qtyBtn} onClick={() => addToCart(item)}>+</button>
                        </div>
                      ) : (
                        <button style={styles.addBtn} onClick={() => addToCart(item)}>+ Agregar</button>
                      )
                    ) : (
                      <span style={{ color: theme.colors.error, fontSize: theme.fontSizes.xs }}>Agotado</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {cartItemCount > 0 && (
        <div style={styles.floatingCart} onClick={() => navigate('/cantina/cart')}>
          <div>
            <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{cartItemCount} items</span>
            <span>| ${cartTotal.toLocaleString('es-AR')}</span>
          </div>
          <div style={{ fontWeight: 'bold' }}>Ver pedido ➔</div>
        </div>
      )}
    </div>
  );
}
