import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { newsService } from '../services/newsService';
import type { News, NewsCategory } from '../types';

function debounce(func: Function, wait: number) {
  let timeout: any;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function NewsScreen() {
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [featured, setFeatured] = useState<News[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNews = async (query: string = '', cat: string = 'Todos') => {
    setLoading(true);
    try {
      if (query) {
        const res = await newsService.searchNews(query);
        setNews(res);
      } else {
        const res = await newsService.getNews();
        if (cat === 'Todos') {
          setNews(res);
        } else {
          setNews(res.filter((n: News) => n.category.slug === cat));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => fetchNews(query, selectedCategory), 300),
    [selectedCategory]
  );

  useEffect(() => {
    newsService.getCategories().then(setCategories).catch(console.error);
    newsService.getFeaturedNews().then(setFeatured).catch(console.error);
  }, []);

  useEffect(() => {
    if (!search) {
      fetchNews('', selectedCategory);
    }
  }, [selectedCategory, search]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    hero: {
      background: `linear-gradient(135deg, ${theme.colors.primary}, #060f26)`,
      padding: '40px 20px',
      color: theme.colors.white,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
    },
    heroTitle: {
      margin: 0,
      fontSize: '2.5rem',
    },
    savedBtn: {
      border: 'none',
      backgroundColor: 'rgba(255,255,255,0.14)',
      color: theme.colors.white,
      borderRadius: theme.borderRadius.md,
      padding: '9px 12px',
      cursor: 'pointer',
      fontWeight: 700,
      whiteSpace: 'nowrap',
    },
    searchContainer: {
      padding: '20px',
    },
    searchInput: {
      width: '100%',
      padding: '12px 20px',
      borderRadius: theme.borderRadius.full,
      border: `1px solid ${theme.colors.border}`,
      fontSize: theme.fontSizes.md,
      boxSizing: 'border-box',
    },
    filters: {
      display: 'flex',
      overflowX: 'auto',
      gap: '10px',
      padding: '0 20px 20px 20px',
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
    content: {
      padding: '0 20px 40px 20px',
    },
    featuredCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      marginBottom: '30px',
      boxShadow: theme.shadows.elevated,
      cursor: 'pointer',
    },
    featuredImage: {
      width: '100%',
      height: '250px',
      objectFit: 'cover',
      backgroundColor: theme.colors.border,
    },
    featuredBody: {
      padding: '20px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      boxShadow: theme.shadows.card,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
    },
    cardImage: {
      width: '100%',
      height: '160px',
      objectFit: 'cover',
      backgroundColor: theme.colors.border,
    },
    cardBody: {
      padding: '15px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    categoryBadge: {
      fontSize: '10px',
      color: theme.colors.secondary,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    cardTitle: {
      margin: '0 0 10px 0',
      fontSize: theme.fontSizes.lg,
    },
    cardSummary: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSizes.sm,
      flex: 1,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    cardFooter: {
      marginTop: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: theme.fontSizes.xs,
      color: theme.colors.textMuted,
    },
    favBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
    }
  };

  const toggleFav = async (e: React.MouseEvent, newsId: number) => {
    e.stopPropagation();
    try {
      await newsService.addFavorite(newsId);
      alert('Noticia guardada');
    } catch (error) {
      console.error(error);
      alert('No pudimos guardar la noticia');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Noticias</h1>
        <button style={styles.savedBtn} onClick={() => navigate('/news/favorites')}>Guardadas</button>
      </div>

      <div style={styles.searchContainer}>
        <input 
          style={styles.searchInput} 
          placeholder="Buscar noticias..." 
          value={search}
          onChange={onSearchChange}
        />
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

      <div style={styles.content}>
        {!search && featured.length > 0 && selectedCategory === 'Todos' && (
          <div style={styles.featuredCard} onClick={() => navigate(`/news/${featured[0].id}`)}>
            <img src={featured[0].imageUrl} style={styles.featuredImage} alt="Featured" />
            <div style={styles.featuredBody}>
              <div style={styles.categoryBadge}>{featured[0].category.name}</div>
              <h2 style={{ margin: '5px 0' }}>{featured[0].title}</h2>
              <p style={{ color: theme.colors.textMuted }}>{featured[0].summary}</p>
              <div style={styles.cardFooter}>
                <span>{new Date(featured[0].publishedAt).toLocaleDateString('es-AR')} • {featured[0].author}</span>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div>Cargando...</div>
        ) : news.length === 0 ? (
          <div>No se encontraron noticias.</div>
        ) : (
          <div style={styles.grid}>
            {news.map(n => (
              <div key={n.id} style={styles.card} onClick={() => navigate(`/news/${n.id}`)}>
                <img src={n.imageUrl} style={styles.cardImage} alt={n.title} />
                <div style={styles.cardBody}>
                  <div style={styles.categoryBadge}>{n.category.name}</div>
                  <h3 style={styles.cardTitle}>{n.title}</h3>
                  <p style={styles.cardSummary}>{n.summary}</p>
                  <div style={styles.cardFooter}>
                    <span>{new Date(n.publishedAt).toLocaleDateString('es-AR')}</span>
                    <button style={styles.favBtn} onClick={(e) => toggleFav(e, n.id)}>♡</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
