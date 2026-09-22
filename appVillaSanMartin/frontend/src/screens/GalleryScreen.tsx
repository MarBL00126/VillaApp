import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { mediaService } from '../services/mediaService';
import type { Gallery, Photo } from '../types';

export function GalleryScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      Promise.all([
        mediaService.getGallery(Number(id)),
        mediaService.getGalleryPhotos(Number(id)).catch(() => [])
      ]).then(([gal, ph]) => {
        setGallery(gal);
        setPhotos(ph);
      }).finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i! + 1) % photos.length);
      if (e.key === 'ArrowLeft') setLightboxIndex(i => (i! - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, photos.length]);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '20px',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '10px',
    },
    photo: {
      width: '100%',
      aspectRatio: '1',
      objectFit: 'cover',
      borderRadius: theme.borderRadius.sm,
      cursor: 'pointer',
      backgroundColor: theme.colors.border,
    },
    lightbox: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    lightboxImg: {
      maxWidth: '90%',
      maxHeight: '80vh',
      objectFit: 'contain',
    },
    lightboxClose: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'none',
      border: 'none',
      color: 'white',
      fontSize: '30px',
      cursor: 'pointer',
    },
    lightboxNav: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(255,255,255,0.2)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      cursor: 'pointer',
      fontSize: '20px',
    },
    lightboxCaption: {
      color: 'white',
      marginTop: '15px',
      fontSize: theme.fontSizes.md,
      textAlign: 'center',
    }
  };

  if (loading) return <div style={styles.container}>Cargando...</div>;
  if (!gallery) return <div style={styles.container}>Galería no encontrada</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <h1 style={styles.title}>{gallery.title}</h1>
      </div>

      <div style={styles.grid}>
        {photos.map((p, i) => (
          <img
            key={p.id}
            src={p.imageUrl}
            style={styles.photo}
            alt={p.caption}
            onClick={() => setLightboxIndex(i)}
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <div style={styles.lightbox} onClick={() => setLightboxIndex(null)}>
          <button style={styles.lightboxClose} onClick={() => setLightboxIndex(null)}>×</button>
          
          <button 
            style={{ ...styles.lightboxNav, left: '20px' }}
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length); }}
          >
            ❮
          </button>
          
          <img 
            src={photos[lightboxIndex].imageUrl} 
            style={styles.lightboxImg} 
            onClick={(e) => e.stopPropagation()} 
            alt={photos[lightboxIndex].caption}
          />
          
          <div style={styles.lightboxCaption} onClick={(e) => e.stopPropagation()}>
            {photos[lightboxIndex].caption}
          </div>

          <button 
            style={{ ...styles.lightboxNav, right: '20px' }}
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % photos.length); }}
          >
            ❯
          </button>
        </div>
      )}
    </div>
  );
}
