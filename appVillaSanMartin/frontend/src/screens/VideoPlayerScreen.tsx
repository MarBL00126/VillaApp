import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { mediaService } from '../services/mediaService';
import type { Video } from '../types';

export function VideoPlayerScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      mediaService.getVideo(Number(id))
        .then(setVideo)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video?.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado');
    }
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    header: {
      padding: '15px 20px',
    },
    backBtn: {
      background: 'none',
      border: 'none',
      color: theme.colors.primary,
      fontSize: theme.fontSizes.lg,
      cursor: 'pointer',
    },
    playerContainer: {
      width: '100%',
      aspectRatio: '16/9',
      backgroundColor: '#000',
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
    },
    info: {
      padding: '20px',
    },
    typeBadge: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.secondary,
      color: theme.colors.primary,
      fontWeight: 'bold',
      fontSize: theme.fontSizes.xs,
      marginBottom: '10px',
    },
    title: {
      margin: '0 0 10px 0',
      fontSize: theme.fontSizes.xl,
      color: theme.colors.text,
    },
    date: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSizes.sm,
      marginBottom: '15px',
    },
    description: {
      fontSize: theme.fontSizes.md,
      lineHeight: 1.5,
      color: theme.colors.text,
      marginBottom: '20px',
    },
    shareBtn: {
      width: '100%',
      padding: '12px',
      border: `1px solid ${theme.colors.primary}`,
      background: 'none',
      color: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      fontWeight: 'bold',
    }
  };

  if (loading) return <div style={styles.container}>Cargando...</div>;
  if (!video) return <div style={styles.container}>Video no encontrado</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Volver</button>
      </div>

      <div style={styles.playerContainer}>
        <iframe
          style={styles.iframe}
          src={video.url}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title}
        />
      </div>

      <div style={styles.info}>
        <div style={styles.typeBadge}>{video.type}</div>
        <h1 style={styles.title}>{video.title}</h1>
        <div style={styles.date}>{new Date(video.publishedAt).toLocaleDateString('es-AR')}</div>
        <p style={styles.description}>{video.description}</p>
        
        <button style={styles.shareBtn} onClick={handleShare}>🔗 Compartir video</button>
      </div>
    </div>
  );
}
