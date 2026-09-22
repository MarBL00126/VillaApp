import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { membershipService } from '../services/membershipService';

export function MembershipScreen() {
  const navigate = useNavigate();
  const [membership, setMembership] = useState<any>(null);
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingFees, setPendingFees] = useState<any[]>([]);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const typesData = await membershipService.getTypes();
        setTypes(typesData);
        
        try {
          const myMembership = await membershipService.getMyMembership();
          setMembership(myMembership);
          
          if (myMembership) {
            const fees = await membershipService.getPendingFees();
            setPendingFees(fees);
          }
        } catch (e: any) {
          if (e.response && e.response.status !== 404) {
            console.error(e);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMembership();
  }, []);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '20px',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    heroNotMember: {
      background: `linear-gradient(135deg, ${theme.colors.primary}, #060f26)`,
      color: theme.colors.white,
      padding: '40px 20px',
      borderRadius: theme.borderRadius.lg,
      marginBottom: '30px',
      textAlign: 'center',
    },
    heroTitle: {
      margin: '0 0 10px 0',
      fontSize: '2rem',
    },
    heroSubtitle: {
      margin: 0,
      opacity: 0.9,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: '20px',
      boxShadow: theme.shadows.card,
      display: 'flex',
      flexDirection: 'column',
    },
    cardTitle: {
      margin: '0 0 10px 0',
      fontSize: theme.fontSizes.lg,
      color: theme.colors.primary,
    },
    cardPriceRow: {
      marginBottom: '5px',
      fontWeight: 'bold',
      fontSize: theme.fontSizes.lg,
    },
    cardPriceSub: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textMuted,
      marginBottom: '15px',
    },
    cardDesc: {
      color: theme.colors.text,
      marginBottom: '20px',
      flex: 1,
    },
    primaryBtn: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.primary,
      border: 'none',
      padding: '12px',
      borderRadius: theme.borderRadius.md,
      fontWeight: 'bold',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'center',
    },
    benefitsSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: '20px',
      boxShadow: theme.shadows.card,
    },
    benefitsTitle: {
      marginTop: 0,
      color: theme.colors.primary,
    },
    benefitsList: {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
    },
    benefitsItem: {
      padding: '10px 0',
      borderBottom: `1px solid ${theme.colors.border}`,
    },
    statusCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      boxShadow: theme.shadows.elevated,
      marginBottom: '20px',
    },
    statusBanner: {
      padding: '10px',
      textAlign: 'center',
      color: '#fff',
      fontWeight: 'bold',
    },
    memberInfo: {
      padding: '20px',
    },
    memberName: {
      margin: '0 0 10px 0',
      fontSize: '1.5rem',
    },
    memberNumber: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: theme.colors.primary,
      margin: '0 0 10px 0',
    },
    memberDetail: {
      margin: '0 0 5px 0',
      color: theme.colors.textMuted,
    },
    actionRow: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
    },
    actionBtn: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      border: 'none',
      padding: '12px',
      borderRadius: theme.borderRadius.md,
      fontWeight: 'bold',
      cursor: 'pointer',
      textAlign: 'center',
    },
    alertBanner: {
      backgroundColor: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: theme.borderRadius.md,
      padding: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    alertText: {
      color: '#92400e',
      fontWeight: 'bold',
      margin: 0,
    },
    alertBtn: {
      backgroundColor: '#f59e0b',
      color: '#fff',
      border: 'none',
      padding: '8px 16px',
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      fontWeight: 'bold',
    }
  };

  if (loading) return <div style={styles.container}>Cargando...</div>;

  if (!membership) {
    return (
      <div style={styles.container}>
        <div style={styles.heroNotMember}>
          <h1 style={styles.heroTitle}>¡Hacete Socio! 🏀</h1>
          <p style={styles.heroSubtitle}>Unite a la familia de Villa San Martín</p>
        </div>
        
        <div style={styles.grid}>
          {types.map(t => (
            <div key={t.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{t.name}</h3>
              <div style={styles.cardPriceRow}>${t.monthlyFee.toLocaleString('es-AR')}/mes</div>
              <div style={styles.cardPriceSub}>Anual: ${t.annualFee.toLocaleString('es-AR')}/año</div>
              <p style={styles.cardDesc}>{t.description || 'Accedé a múltiples beneficios en el club.'}</p>
              <button 
                style={styles.primaryBtn}
                onClick={() => navigate('/membership/signup', { state: { selectedTypeId: t.id } })}
              >
                Unirme
              </button>
            </div>
          ))}
        </div>

        <div style={styles.benefitsSection}>
          <h3 style={styles.benefitsTitle}>Beneficios de ser socio</h3>
          <ul style={styles.benefitsList}>
            <li style={styles.benefitsItem}>🎟️ Descuentos en entradas</li>
            <li style={styles.benefitsItem}>🛍️ Precios especiales en tienda</li>
            <li style={styles.benefitsItem}>🍔 Descuentos en cantina</li>
            <li style={styles.benefitsItem}>🏆 Contenido exclusivo</li>
          </ul>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    if (status === 'ACTIVE') return '#065f46';
    if (status === 'SUSPENDED') return '#b45309';
    if (status === 'CANCELLED') return '#991b1b';
    return theme.colors.textMuted;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'ACTIVE') return 'ACTIVO';
    if (status === 'SUSPENDED') return 'SUSPENDIDO';
    if (status === 'CANCELLED') return 'CANCELADO';
    return status;
  };

  return (
    <div style={styles.container}>
      {pendingFees.length > 0 && (
        <div style={styles.alertBanner}>
          <p style={styles.alertText}>Tenés cuotas pendientes</p>
          <button style={styles.alertBtn} onClick={() => navigate('/fees')}>Ver</button>
        </div>
      )}

      <div style={styles.statusCard}>
        <div style={{ ...styles.statusBanner, backgroundColor: getStatusColor(membership.status) }}>
          ESTADO: {getStatusLabel(membership.status)}
        </div>
        <div style={styles.memberInfo}>
          <h2 style={styles.memberName}>{membership.fullName || 'Socio'}</h2>
          <div style={styles.memberNumber}>N° {membership.memberNumber || '---'}</div>
          <p style={styles.memberDetail}>Tipo: {membership.type?.name || 'Membresía'}</p>
          <p style={styles.memberDetail}>
            Ingreso: {membership.createdAt ? new Date(membership.createdAt).toLocaleDateString('es-AR') : '---'}
          </p>

          <div style={styles.actionRow}>
            <button style={styles.actionBtn} onClick={() => navigate('/membership/card')}>
              🪪 Mi Carnet
            </button>
            <button style={styles.actionBtn} onClick={() => navigate('/fees')}>
              💳 Mis Cuotas
            </button>
            <button style={styles.actionBtn} onClick={() => navigate('/benefits')}>
              🎁 Beneficios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
