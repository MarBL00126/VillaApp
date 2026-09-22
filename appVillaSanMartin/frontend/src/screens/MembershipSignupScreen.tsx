import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../theme';
import { membershipService } from '../services/membershipService';

export function MembershipSignupScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { selectedTypeId?: number } | null;
  
  const [types, setTypes] = useState<any[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(state?.selectedTypeId || null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    membershipService.getTypes()
      .then(res => setTypes(res))
      .catch(console.error)
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async () => {
    if (!selectedTypeId) return;
    setLoading(true);
    try {
      await membershipService.signup(selectedTypeId);
      alert('¡Membresía confirmada con éxito!');
      navigate('/membership');
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data?.message || 'Error al confirmar la membresía');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = types.find(t => t.id === selectedTypeId);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '20px',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '20px',
    },
    backBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: theme.colors.text,
      padding: 0,
    },
    title: {
      margin: 0,
      color: theme.colors.primary,
    },
    sectionTitle: {
      marginTop: '30px',
      marginBottom: '15px',
      color: theme.colors.text,
    },
    cardList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    typeCard: {
      backgroundColor: theme.colors.surface,
      border: `2px solid`,
      borderRadius: theme.borderRadius.md,
      padding: '15px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    radio: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      border: `2px solid ${theme.colors.primary}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioInner: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: theme.colors.primary,
    },
    typeInfo: {
      flex: 1,
    },
    typeName: {
      margin: '0 0 5px 0',
      fontSize: theme.fontSizes.md,
      fontWeight: 'bold',
    },
    typePrice: {
      margin: 0,
      color: theme.colors.textMuted,
      fontSize: theme.fontSizes.sm,
    },
    summarySection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: '20px',
      marginTop: '30px',
      boxShadow: theme.shadows.card,
    },
    benefitsList: {
      listStyleType: 'none',
      padding: 0,
      margin: '15px 0',
    },
    benefitsItem: {
      padding: '5px 0',
      color: theme.colors.text,
    },
    submitBtn: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.primary,
      border: 'none',
      padding: '16px',
      borderRadius: theme.borderRadius.md,
      fontWeight: 'bold',
      fontSize: theme.fontSizes.md,
      cursor: 'pointer',
      width: '100%',
      marginTop: '20px',
      opacity: loading || !selectedTypeId ? 0.7 : 1,
    }
  };

  if (fetching) return <div style={styles.container}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <h2 style={styles.title}>Hacete Socio del Club</h2>
      </div>

      <div style={styles.cardList}>
        {types.map(t => {
          const isSelected = selectedTypeId === t.id;
          return (
            <div 
              key={t.id} 
              style={{
                ...styles.typeCard,
                borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                backgroundColor: isSelected ? 'rgba(13, 31, 78, 0.05)' : theme.colors.surface
              }}
              onClick={() => setSelectedTypeId(t.id)}
            >
              <div style={styles.radio}>
                {isSelected && <div style={styles.radioInner} />}
              </div>
              <div style={styles.typeInfo}>
                <h4 style={styles.typeName}>{t.name}</h4>
                <p style={styles.typePrice}>${t.monthlyFee.toLocaleString('es-AR')}/mes</p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPlan && (
        <div style={styles.summarySection}>
          <h3 style={{ margin: '0 0 15px 0', color: theme.colors.primary }}>Resumen de tu plan</h3>
          <p><strong>Plan seleccionado:</strong> {selectedPlan.name}</p>
          <p><strong>Cuota mensual:</strong> ${selectedPlan.monthlyFee.toLocaleString('es-AR')}</p>
          
          <h4 style={{ marginTop: '20px' }}>Al hacerte socio vas a poder:</h4>
          <ul style={styles.benefitsList}>
            <li style={styles.benefitsItem}>🎟️ Comprar entradas con descuento</li>
            <li style={styles.benefitsItem}>🛍️ Acceder a precios exclusivos en la tienda</li>
            <li style={styles.benefitsItem}>🍔 Disfrutar de promos en la cantina</li>
            <li style={styles.benefitsItem}>🏆 Ver contenido exclusivo</li>
          </ul>

          <button 
            style={styles.submitBtn} 
            onClick={handleSubmit}
            disabled={loading || !selectedTypeId}
          >
            {loading ? 'Procesando...' : 'Confirmar membresía'}
          </button>
        </div>
      )}
    </div>
  );
}
