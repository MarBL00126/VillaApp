import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { shopService } from '../services/shopService';
import type { FavoriteProduct } from '../types';

export function FavoriteProductsScreen() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      setFavorites(await shopService.getFavorites());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (event: React.MouseEvent, productId: number) => {
    event.stopPropagation();
    await shopService.removeFavorite(productId);
    setFavorites((current) => current.filter((fav) => fav.product.id !== productId));
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '20px',
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
      gap: '12px',
    },
    title: {
      margin: 0,
      color: theme.colors.text,
      fontSize: theme.fontSizes.title,
    },
    backBtn: {
      border: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.surface,
      color: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: '9px 12px',
      cursor: 'pointer',
      fontWeight: 700,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '15px',
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      boxShadow: theme.shadows.card,
      cursor: 'pointer',
    },
    image: {
      width: '100%',
      height: '150px',
      objectFit: 'cover',
      backgroundColor: theme.colors.border,
    },
    placeholder: {
      height: '150px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.border,
      color: theme.colors.textMuted,
    },
    body: {
      padding: '12px',
    },
    name: {
      margin: '0 0 6px',
      color: theme.colors.text,
      fontSize: theme.fontSizes.md,
    },
    priceRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px',
    },
    price: {
      margin: 0,
      color: theme.colors.primary,
      fontWeight: 800,
    },
    removeBtn: {
      border: 'none',
      backgroundColor: theme.colors.background,
      color: theme.colors.error,
      borderRadius: theme.borderRadius.md,
      padding: '7px 9px',
      cursor: 'pointer',
      fontWeight: 700,
    },
    empty: {
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.md,
      padding: '22px',
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Productos favoritos</h1>
        <button style={styles.backBtn} onClick={() => navigate('/shop')}>Volver a tienda</button>
      </div>

      {loading ? (
        <div>Cargando favoritos...</div>
      ) : favorites.length === 0 ? (
        <div style={styles.empty}>Todavia no guardaste productos.</div>
      ) : (
        <div style={styles.grid}>
          {favorites.map(({ id, product }) => (
            <div key={id} style={styles.card} onClick={() => navigate(`/shop/products/${product.id}`)}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} style={styles.image} />
              ) : (
                <div style={styles.placeholder}>Sin imagen</div>
              )}
              <div style={styles.body}>
                <h3 style={styles.name}>{product.name}</h3>
                <div style={styles.priceRow}>
                  <p style={styles.price}>${product.price.toLocaleString('es-AR')}</p>
                  <button style={styles.removeBtn} onClick={(event) => removeFavorite(event, product.id)}>
                    Quitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
