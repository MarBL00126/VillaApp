import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { shopService } from '../services/shopService';
import type { Product, ProductVariant } from '../types';

export function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      Promise.all([
        shopService.getProduct(Number(id)),
        shopService.getVariants(Number(id)).catch(() => []),
        shopService.getFavorites().catch(() => [])
      ]).then(([prod, vars, favs]) => {
        setProduct(prod);
        setVariants(vars);
        setIsFavorite(favs.some((fav: any) => fav.product?.id === prod.id));
        if (vars.length > 0) setSelectedVariant(vars[0]);
        setLoading(false);
      });
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await shopService.addToCart(product.id, selectedVariant?.id || null, quantity);
      alert('Producto agregado al carrito con éxito');
    } catch (e) {
      console.error(e);
      alert('Error al agregar al carrito');
    }
  };

  const shareProduct = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Enlace copiado al portapapeles');
  };

  const toggleFavorite = async () => {
    if (!product) return;
    try {
      if (isFavorite) {
        await shopService.removeFavorite(product.id);
        setIsFavorite(false);
      } else {
        await shopService.addFavorite(product.id);
        setIsFavorite(true);
      }
    } catch (e) {
      console.error(e);
      alert('No pudimos actualizar favoritos');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Cargando...</div>;
  if (!product) return <div style={{ padding: '20px' }}>Producto no encontrado</div>;

  const stock = selectedVariant ? selectedVariant.stock : 100; // default stock if no variants
  const isOutOfStock = stock <= 0;

  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    header: {
      padding: '15px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backBtn: {
      background: 'none',
      border: 'none',
      color: theme.colors.primary,
      fontSize: theme.fontSizes.lg,
      cursor: 'pointer',
    },
    imageArea: {
      width: '100%',
      height: '300px',
      backgroundColor: theme.colors.border,
      backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : `linear-gradient(45deg, #ccc, #eee)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    content: {
      padding: '20px',
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      marginTop: '-20px',
      position: 'relative',
    },
    category: {
      color: theme.colors.primary,
      textTransform: 'uppercase',
      fontSize: theme.fontSizes.xs,
      fontWeight: 'bold',
    },
    title: {
      margin: '5px 0',
      fontSize: theme.fontSizes.xl,
    },
    price: {
      color: theme.colors.secondary,
      fontSize: theme.fontSizes.title,
      fontWeight: 'bold',
      margin: '10px 0',
    },
    description: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSizes.sm,
      lineHeight: 1.5,
    },
    variants: {
      marginTop: '20px',
    },
    pill: {
      padding: '8px 16px',
      borderRadius: theme.borderRadius.full,
      border: `1px solid ${theme.colors.border}`,
      marginRight: '10px',
      cursor: 'pointer',
      display: 'inline-block',
    },
    activePill: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      borderColor: theme.colors.primary,
    },
    stock: {
      marginTop: '10px',
      fontWeight: 'bold',
      color: isOutOfStock ? theme.colors.error : theme.colors.success,
    },
    qtyControls: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '20px',
      gap: '15px',
    },
    qtyBtn: {
      padding: '10px 15px',
      border: `1px solid ${theme.colors.border}`,
      background: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
    },
    addBtn: {
      width: '100%',
      padding: '15px',
      backgroundColor: isOutOfStock ? theme.colors.border : theme.colors.primary,
      color: isOutOfStock ? theme.colors.textMuted : theme.colors.white,
      border: 'none',
      borderRadius: theme.borderRadius.md,
      marginTop: '20px',
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
    },
    actionBtn: {
      flex: 1,
      padding: '10px',
      background: 'none',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.md,
      margin: '0 5px',
      cursor: 'pointer',
      color: theme.colors.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Tienda</button>
      </div>
      <div style={styles.imageArea} />
      <div style={styles.content}>
        <div style={styles.category}>{product.category.name}</div>
        <h1 style={styles.title}>{product.name}</h1>
        <div style={styles.price}>${product.price.toLocaleString('es-AR')}</div>
        <p style={styles.description}>{product.description}</p>

        {variants.length > 0 && (
          <div style={styles.variants}>
            <h4>Variantes:</h4>
            {variants.map(v => (
              <div
                key={v.id}
                style={{ ...styles.pill, ...(selectedVariant?.id === v.id ? styles.activePill : {}) }}
                onClick={() => setSelectedVariant(v)}
              >
                {v.label}
              </div>
            ))}
          </div>
        )}

        <div style={styles.stock}>
          {isOutOfStock ? '✗ Sin stock' : `✓ En stock (${stock})`}
        </div>

        <div style={styles.qtyControls}>
          <button style={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button style={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        <button style={styles.addBtn} disabled={isOutOfStock} onClick={handleAddToCart}>
          Agregar al carrito
        </button>

        <div style={styles.actions}>
          <button style={styles.actionBtn} onClick={toggleFavorite}>
            {isFavorite ? '♥ Guardado' : '♡ Favorito'}
          </button>
          <button style={styles.actionBtn} onClick={shareProduct}>🔗 Compartir</button>
        </div>
      </div>
    </div>
  );
}
