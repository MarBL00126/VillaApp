import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { newsService } from '../services/newsService';
import type { FavoriteNews } from '../types';

export function FavoriteNewsScreen() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsService.getFavoriteNews()
      .then(setFavorites)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const removeFavorite = async (event: React.MouseEvent, newsId: number) => {
    event.stopPropagation();
    await newsService.removeFavorite(newsId);
    setFavorites((current) => current.filter((fav) => fav.news.id !== newsId));
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
    list: {
      display: 'grid',
      gap: '15px',
    },
    card: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      boxShadow: theme.shadows.card,
      cursor: 'pointer',
    },
    image: {
      width: '120px',
      height: '120px',
      objectFit: 'cover',
      backgroundColor: theme.colors.border,
    },
    body: {
      padding: '12px',
      minWidth: 0,
    },
    category: {
      color: theme.colors.secondary,
      fontSize: theme.fontSizes.xs,
      fontWeight: 800,
      textTransform: 'uppercase',
    },
    headline: {
      margin: '4px 0 6px',
      color: theme.colors.text,
      fontSize: theme.fontSizes.lg,
    },
    summary: {
      margin: '0 0 10px',
      color: theme.colors.textMuted,
      fontSize: theme.fontSizes.sm,
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px',
      color: theme.colors.textMuted,
      fontSize: theme.fontSizes.xs,
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
        <h1 style={styles.title}>Noticias guardadas</h1>
        <button style={styles.backBtn} onClick={() => navigate('/news')}>Volver a noticias</button>
      </div>

      {loading ? (
        <div>Cargando noticias...</div>
      ) : favorites.length === 0 ? (
        <div style={styles.empty}>Todavia no guardaste noticias.</div>
      ) : (
        <div style={styles.list}>
          {favorites.map(({ id, news }) => (
            <div key={id} style={styles.card} onClick={() => navigate(`/news/${news.id}`)}>
              <img src={news.imageUrl || 'https://via.placeholder.com/120'} alt={news.title} style={styles.image} />
              <div style={styles.body}>
                <div style={styles.category}>{news.category?.name}</div>
                <h3 style={styles.headline}>{news.title}</h3>
                <p style={styles.summary}>{news.summary}</p>
                <div style={styles.footer}>
                  <span>{new Date(news.publishedAt).toLocaleDateString('es-AR')}</span>
                  <button style={styles.removeBtn} onClick={(event) => removeFavorite(event, news.id)}>
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
