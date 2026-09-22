import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { mediaService } from '../services/mediaService';
import type { Gallery, Video } from '../types';

export function MediaScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'FOTOS' | 'VIDEOS' | 'HIGHLIGHTS' | 'ENTREVISTAS'>('FOTOS');
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (tab === 'FOTOS') {
      mediaService.getGalleries().then(setGalleries).finally(() => setLoading(false));
    } else {
      let type = '';
      if (tab === 'HIGHLIGHTS') type = 'HIGHLIGHT';
      if (tab === 'ENTREVISTAS') type = 'INTERVIEW';
      
      const fetchCall = type ? mediaService.getVideosByType(type) : mediaService.getVideos();
      fetchCall.then(setVideos).finally(() => setLoading(false));
    }
  }, [tab]);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    header: {
      background: `linear-gradient(135deg, ${theme.colors.primary}, #060f26)`,
      padding: '30px 20px',
      color: theme.colors.white,
      textAlign: 'center',
    },
    title: { margin: 0, fontSize: theme.fontSizes.title },
    tabs: {
      display: 'flex',
      overflowX: 'auto',
      backgroundColor: theme.colors.surface,
      borderBottom: `1px solid ${theme.colors.border}`,
    },
    tab: {
      flex: 1,
      padding: '15px 20px',
      textAlign: 'center',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      fontWeight: 'bold',
      color: theme.colors.textMuted,
      borderBottom: '3px solid transparent',
    },
    activeTab: {
      color: theme.colors.primary,
      borderBottom: `3px solid ${theme.colors.primary}`,
    },
    content: {
      padding: '20px',
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
    },
    image: {
      width: '100%',
      height: '150px',
      objectFit: 'cover',
      backgroundColor: theme.colors.border,
    },
    cardInfo: {
      padding: '10px',
    },
    cardTitle: {
      margin: '0 0 5px 0',
      fontSize: theme.fontSizes.sm,
    },
    cardDate: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSizes.xs,
    },
    videoCard: {
      display: 'flex',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      marginBottom: '15px',
      boxShadow: theme.shadows.card,
      cursor: 'pointer',
    },
    videoThumb: {
      width: '140px',
      height: '100px',
      objectFit: 'cover',
      backgroundColor: theme.colors.border,
      position: 'relative',
    },
    playIcon: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '24px',
      color: 'white',
      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    },
    videoInfo: {
      padding: '10px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    typeBadge: {
      fontSize: '10px',
      color: theme.colors.secondary,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      marginBottom: '5px',
    }
  };

  const tabs = [
    { id: 'FOTOS', label: '🖼 Fotos' },
    { id: 'VIDEOS', label: '🎬 Videos' },
    { id: 'HIGHLIGHTS', label: '🏀 Highlights' },
    { id: 'ENTREVISTAS', label: '🎙 Entrevistas' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Multimedia</h1>
      </div>

      <div style={styles.tabs}>
        {tabs.map(t => (
          <div
            key={t.id}
            style={{ ...styles.tab, ...(tab === t.id ? styles.activeTab : {}) }}
            onClick={() => setTab(t.id as any)}
          >
            {t.label}
          </div>
        ))}
      </div>

      <div style={styles.content}>
        {loading ? (
          <div>Cargando...</div>
        ) : tab === 'FOTOS' ? (
          <div style={styles.grid}>
            {galleries.map(g => (
              <div key={g.id} style={styles.card} onClick={() => navigate(`/media/galleries/${g.id}`)}>
                <img src={g.coverImageUrl} style={styles.image} alt={g.title} />
                <div style={styles.cardInfo}>
                  <h4 style={styles.cardTitle}>{g.title}</h4>
                  <div style={styles.cardDate}>{new Date(g.eventDate).toLocaleDateString('es-AR')}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {videos.map(v => (
              <div key={v.id} style={styles.videoCard} onClick={() => navigate(`/media/videos/${v.id}`)}>
                <div style={{ position: 'relative' }}>
                  <img src={v.thumbnail} style={styles.videoThumb} alt={v.title} />
                  <div style={styles.playIcon}>▶</div>
                </div>
                <div style={styles.videoInfo}>
                  <div style={styles.typeBadge}>{v.type}</div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: theme.fontSizes.sm }}>{v.title}</h4>
                  <div style={styles.cardDate}>{new Date(v.publishedAt).toLocaleDateString('es-AR')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
