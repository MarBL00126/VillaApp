import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { shopService } from '../services/shopService';
import type { Product, ProductCategory } from '../types';

export function ShopScreen() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cats, prods, cart] = await Promise.all([
        shopService.getCategories(),
        selectedCategory === 'Todos' ? shopService.getProducts() : shopService.getByCategory(selectedCategory),
        shopService.getCart().catch(() => ({ items: [] }))
      ]);
      setCategories(cats);
      setProducts(prods);
      setCartCount(cart?.items?.length || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '20px',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    header: {
      background: `linear-gradient(135deg, ${theme.colors.primary}, #060f26)`,
      color: theme.colors.white,
      padding: '30px 20px',
      borderRadius: theme.borderRadius.lg,
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '14px',
    },
    title: {
      margin: 0,
      fontSize: theme.fontSizes.title,
    },
    cartIcon: {
      cursor: 'pointer',
      position: 'relative',
      fontSize: '24px',
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    headerBtn: {
      border: 'none',
      backgroundColor: 'rgba(255,255,255,0.14)',
      color: theme.colors.white,
      borderRadius: theme.borderRadius.md,
      padding: '9px 12px',
      cursor: 'pointer',
      fontWeight: 700,
    },
    badge: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: theme.colors.secondary,
      color: theme.colors.primary,
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    filters: {
      display: 'flex',
      overflowX: 'auto',
      gap: '10px',
      marginBottom: '20px',
      paddingBottom: '10px',
    },
    pill: {
      padding: '8px 16px',
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface,
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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '15px',
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      boxShadow: theme.shadows.card,
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    imagePlaceholder: {
      width: '100%',
      height: '150px',
      background: `linear-gradient(45deg, ${theme.colors.border}, ${theme.colors.background})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.colors.textMuted,
    },
    image: {
      width: '100%',
      height: '150px',
      objectFit: 'cover',
    },
    cardBody: {
      padding: '10px',
    },
    categoryBadge: {
      fontSize: '10px',
      color: theme.colors.primary,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      marginBottom: '4px',
      display: 'block',
    },
    productName: {
      margin: '0 0 5px 0',
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
    },
    price: {
      margin: 0,
      fontWeight: 'bold',
      color: theme.colors.text,
      fontSize: theme.fontSizes.lg,
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tienda</h1>
        <div style={styles.headerActions}>
          <button style={styles.headerBtn} onClick={() => navigate('/shop/favorites')}>
            Favoritos
          </button>
          <div style={styles.cartIcon} onClick={() => navigate('/shop/cart')}>
            🛍️
            {cartCount > 0 && <div style={styles.badge}>{cartCount}</div>}
          </div>
        </div>
      </div>

      <div style={styles.filters}>
        <div
          style={{ ...styles.pill, ...(selectedCategory === 'Todos' ? styles.activePill : {}) }}
          onClick={() => setSelectedCategory('Todos')}
        >
          Todos
        </div>
        {categories.map(cat => (
          <div
            key={cat.id}
            style={{ ...styles.pill, ...(selectedCategory === cat.slug ? styles.activePill : {}) }}
            onClick={() => setSelectedCategory(cat.slug)}
          >
            {cat.name}
          </div>
        ))}
      </div>

      {loading ? (
        <div>Cargando productos...</div>
      ) : products.length === 0 ? (
        <div>No hay productos disponibles.</div>
      ) : (
        <div style={styles.grid}>
          {products.map(p => (
            <div key={p.id} style={styles.card} onClick={() => navigate(`/shop/products/${p.id}`)}>
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} style={styles.image} />
              ) : (
                <div style={styles.imagePlaceholder}>Sin Imagen</div>
              )}
              <div style={styles.cardBody}>
                <span style={styles.categoryBadge}>{p.category.name}</span>
                <h3 style={styles.productName}>{p.name}</h3>
                <p style={styles.price}>${p.price.toLocaleString('es-AR')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
