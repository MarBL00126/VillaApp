import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { newsService } from '../services/newsService';
import type { News } from '../types';

export function NewsDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [related, setRelated] = useState<News[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      newsService.getNewsById(Number(id))
        .then(data => {
          setNews(data);
          // Fetch related (simulating by fetching all and picking 3)
          newsService.getNews().then(all => {
            setRelated(all.filter((n: News) => n.id !== data.id).slice(0, 3));
          });
          newsService.getFavoriteNews()
            .then((favorites) => setIsFavorite(favorites.some((fav: any) => fav.news?.id === data.id)))
            .catch(() => setIsFavorite(false));
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado');
    }
  };

  const toggleFavorite = async () => {
    if (!news) return;
    try {
      if (isFavorite) {
        await newsService.removeFavorite(news.id);
        setIsFavorite(false);
      } else {
        await newsService.addFavorite(news.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(error);
      alert('No pudimos actualizar favoritos');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Cargando...</div>;
  if (!news) return <div style={{ padding: '20px' }}>Noticia no encontrada</div>;

  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    hero: {
      position: 'relative',
      width: '100%',
      height: '250px',
    },
    heroImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    backBtn: {
      position: 'absolute',
      top: '15px',
      left: '15px',
      background: 'rgba(0,0,0,0.5)',
      color: 'white',
      border: 'none',
      borderRadius: theme.borderRadius.full,
      padding: '8px 15px',
      cursor: 'pointer',
    },
    content: {
      padding: '20px',
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.lg,
      borderTopRightRadius: theme.borderRadius.lg,
      marginTop: '-20px',
      position: 'relative',
    },
    meta: {
      display: 'flex',
      justifyContent: 'space-between',
      color: theme.colors.textMuted,
      fontSize: theme.fontSizes.sm,
      marginBottom: '15px',
    },
    category: {
      color: theme.colors.secondary,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    title: {
      fontSize: '2rem',
      margin: '0 0 20px 0',
      lineHeight: 1.2,
    },
    body: {
      fontSize: theme.fontSizes.md,
      lineHeight: 1.6,
      color: theme.colors.text,
      whiteSpace: 'pre-wrap',
    },
    actions: {
      display: 'flex',
      gap: '10px',
      marginTop: '30px',
      borderTop: `1px solid ${theme.colors.border}`,
      paddingTop: '20px',
    },
    actionBtn: {
      flex: 1,
      padding: '10px',
      border: `1px solid ${theme.colors.border}`,
      background: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
    },
    relatedSection: {
      padding: '20px',
    },
    relatedTitle: {
      fontSize: theme.fontSizes.lg,
      marginBottom: '15px',
    },
    relatedCard: {
      display: 'flex',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      marginBottom: '15px',
      boxShadow: theme.shadows.card,
      cursor: 'pointer',
    },
    relatedImg: {
      width: '100px',
      height: '80px',
      objectFit: 'cover',
    },
    relatedInfo: {
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    relatedCardTitle: {
      margin: '0 0 5px 0',
      fontSize: theme.fontSizes.sm,
    },
    relatedDate: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.textMuted,
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <img src={news.imageUrl || 'https://via.placeholder.com/600'} style={styles.heroImg} alt={news.title} />
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
      </div>
      
      <div style={styles.content}>
        <div style={styles.meta}>
          <span style={styles.category}>{news.category.name}</span>
          <span>{new Date(news.publishedAt).toLocaleDateString('es-AR')} • {news.author}</span>
        </div>
        
        <h1 style={styles.title}>{news.title}</h1>
        <div style={styles.body}>{news.content}</div>

        <div style={styles.actions}>
          <button style={styles.actionBtn} onClick={toggleFavorite}>
            {isFavorite ? '♥ Guardada' : '♡ Guardar'}
          </button>
          <button style={styles.actionBtn} onClick={handleShare}>🔗 Compartir</button>
        </div>
      </div>

      {related.length > 0 && (
        <div style={styles.relatedSection}>
          <h3 style={styles.relatedTitle}>Noticias relacionadas</h3>
          {related.map(r => (
            <div key={r.id} style={styles.relatedCard} onClick={() => navigate(`/news/${r.id}`)}>
              <img src={r.imageUrl || 'https://via.placeholder.com/100'} style={styles.relatedImg} alt={r.title} />
              <div style={styles.relatedInfo}>
                <h4 style={styles.relatedCardTitle}>{r.title}</h4>
                <span style={styles.relatedDate}>{new Date(r.publishedAt).toLocaleDateString('es-AR')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
