import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { membershipService } from '../services/membershipService';

const TYPE_LABELS: Record<string, string> = {
  SHOP_DISCOUNT: '🛍️ Descuentos en Tienda',
  CANTINA_DISCOUNT: '🍔 Descuentos en Cantina',
  PRESALE: '🎟️ Preventas',
  EXCLUSIVE_CONTENT: '🎬 Contenido Exclusivo',
};

export function BenefitsScreen() {
  const navigate = useNavigate();
  const [benefits, setBenefits] = useState<any[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const publicBenefits = await membershipService.getBenefits();
        setBenefits(publicBenefits);

        try {
          await membershipService.getMyBenefits();
          setIsMember(true);
        } catch (e) {
          setIsMember(false);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBenefits();
  }, []);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '20px',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    hero: {
      background: `linear-gradient(135deg, ${theme.colors.primary}, #060f26)`,
      color: theme.colors.white,
      padding: '30px 20px',
      borderRadius: theme.borderRadius.lg,
      marginBottom: '20px',
      textAlign: 'center',
    },
    heroTitle: {
      margin: 0,
      fontSize: '2rem',
    },
    ctaBanner: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.primary,
      padding: '20px',
      borderRadius: theme.borderRadius.md,
      textAlign: 'center',
      marginBottom: '30px',
      boxShadow: theme.shadows.card,
    },
    ctaBtn: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      border: 'none',
      padding: '10px 20px',
      borderRadius: theme.borderRadius.sm,
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px',
    },
    sectionTitle: {
      color: theme.colors.primary,
      borderBottom: `2px solid ${theme.colors.secondary}`,
      paddingBottom: '5px',
      marginTop: '30px',
      marginBottom: '15px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: '20px',
      boxShadow: theme.shadows.card,
      position: 'relative',
      overflow: 'hidden',
    },
    cardTitle: {
      margin: '0 0 10px 0',
      fontSize: theme.fontSizes.lg,
    },
    cardDesc: {
      margin: 0,
      color: theme.colors.textMuted,
      fontSize: theme.fontSizes.sm,
    },
    badge: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.primary,
      padding: '5px 10px',
      borderRadius: theme.borderRadius.full,
      fontWeight: 'bold',
      display: 'inline-block',
      marginTop: '15px',
    },
    overlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      backdropFilter: 'blur(2px)',
    },
    lockIcon: {
      fontSize: '24px',
      marginBottom: '5px',
    },
    lockText: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    }
  };

  const groupedBenefits = benefits.reduce((acc: any, curr: any) => {
    const type = curr.type || 'OTHER';
    if (!acc[type]) acc[type] = [];
    acc[type].push(curr);
    return acc;
  }, {});

  if (loading) return <div style={styles.container}>Cargando beneficios...</div>;

  const displayBenefits = benefits.length > 0 ? groupedBenefits : {
    SHOP_DISCOUNT: [{ id: 1, title: '20% en Camisetas', description: 'Descuento exclusivo en indumentaria oficial', discountPct: 20 }],
    CANTINA_DISCOUNT: [{ id: 2, title: '15% en Combos', description: 'Promo en cantina los días de partido', discountPct: 15 }],
    PRESALE: [{ id: 3, title: 'Preventa Entradas VIP', description: 'Acceso 48hs antes a ubicaciones preferenciales' }],
    EXCLUSIVE_CONTENT: [{ id: 4, title: 'Entrenamientos en vivo', description: 'Acceso a transmisiones exclusivas de prácticas' }]
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Beneficios para Socios 🎁</h1>
      </div>

      {!isMember && (
        <div style={styles.ctaBanner}>
          <h3 style={{ margin: '0 0 10px 0' }}>Hacete socio para acceder a todos los beneficios</h3>
          <button style={styles.ctaBtn} onClick={() => navigate('/membership')}>
            Ver Planes de Membresía
          </button>
        </div>
      )}

      {Object.keys(displayBenefits).map(type => (
        <div key={type}>
          <h2 style={styles.sectionTitle}>{TYPE_LABELS[type] || type}</h2>
          <div style={styles.grid}>
            {displayBenefits[type].map((b: any) => (
              <div key={b.id} style={{ ...styles.card, opacity: isMember ? 1 : 0.7 }}>
                <h3 style={styles.cardTitle}>{b.title}</h3>
                <p style={styles.cardDesc}>{b.description}</p>
                {b.discountPct && (
                  <div style={styles.badge}>{b.discountPct}% OFF</div>
                )}
                {!isMember && (
                  <div style={styles.overlay}>
                    <div style={styles.lockIcon}>🔒</div>
                    <div style={styles.lockText}>Solo socios</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
