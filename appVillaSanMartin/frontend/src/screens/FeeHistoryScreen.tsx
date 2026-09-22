import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { membershipService } from '../services/membershipService';

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export function FeeHistoryScreen() {
  const navigate = useNavigate();
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todas');

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const data = await membershipService.getMyFees();
      setFees(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (feeId: number) => {
    try {
      const res = await membershipService.payFee(feeId);
      if (res && res.initPoint) {
        window.open(res.initPoint, '_blank');
      }
    } catch (e) {
      console.error(e);
      alert('Error al procesar pago');
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'PENDING') return { bg: '#fef3c7', text: '#92400e', label: 'Pendiente' };
    if (status === 'PAID') return { bg: '#d1fae5', text: '#065f46', label: 'Pagada' };
    if (status === 'OVERDUE') return { bg: '#fee2e2', text: '#991b1b', label: 'Vencida' };
    if (status === 'CANCELLED') return { bg: '#f3f4f6', text: '#6b7280', label: 'Cancelada' };
    return { bg: '#eee', text: '#333', label: status };
  };

  const filteredFees = fees.filter(f => {
    if (filter === 'Pendiente') return f.status === 'PENDING';
    if (filter === 'Paga') return f.status === 'PAID';
    if (filter === 'Vencida') return f.status === 'OVERDUE';
    return true;
  });

  const totalPaid = fees.filter(f => f.status === 'PAID').length;
  const totalPending = fees.filter(f => f.status === 'PENDING').length;
  const totalOverdue = fees.filter(f => f.status === 'OVERDUE').length;

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
    statsRow: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
    },
    statBox: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: '10px',
      textAlign: 'center',
      boxShadow: theme.shadows.card,
    },
    statValue: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      margin: '0 0 5px 0',
    },
    statLabel: {
      fontSize: '0.8rem',
      color: theme.colors.textMuted,
      margin: 0,
    },
    filters: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      overflowX: 'auto',
      paddingBottom: '5px',
    },
    pill: {
      padding: '6px 12px',
      borderRadius: theme.borderRadius.full,
      border: `1px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.surface,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    activePill: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      border: `1px solid ${theme.colors.primary}`,
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: '15px',
      boxShadow: theme.shadows.card,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardLeft: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
    },
    monthText: {
      fontWeight: 'bold',
      fontSize: theme.fontSizes.md,
      margin: 0,
    },
    dateText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textMuted,
      margin: 0,
    },
    amountText: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      margin: 0,
    },
    cardRight: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '10px',
    },
    badge: {
      padding: '4px 8px',
      borderRadius: theme.borderRadius.sm,
      fontSize: '0.75rem',
      fontWeight: 'bold',
    },
    payBtn: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      border: 'none',
      padding: '6px 12px',
      borderRadius: theme.borderRadius.sm,
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    emptyState: {
      textAlign: 'center',
      color: theme.colors.textMuted,
      marginTop: '40px',
    }
  };

  if (loading) return <div style={styles.container}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <h2 style={styles.title}>Mis Cuotas</h2>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <p style={{ ...styles.statValue, color: '#065f46' }}>{totalPaid}</p>
          <p style={styles.statLabel}>Pagadas</p>
        </div>
        <div style={styles.statBox}>
          <p style={{ ...styles.statValue, color: '#b45309' }}>{totalPending}</p>
          <p style={styles.statLabel}>Pendientes</p>
        </div>
        <div style={styles.statBox}>
          <p style={{ ...styles.statValue, color: '#991b1b' }}>{totalOverdue}</p>
          <p style={styles.statLabel}>Vencidas</p>
        </div>
      </div>

      <div style={styles.filters}>
        {['Todas', 'Pendiente', 'Paga', 'Vencida'].map(f => (
          <div
            key={f}
            style={{ ...styles.pill, ...(filter === f ? styles.activePill : {}) }}
            onClick={() => setFilter(f)}
          >
            {f}
          </div>
        ))}
      </div>

      <div style={styles.list}>
        {filteredFees.length === 0 ? (
          <div style={styles.emptyState}>No tenés cuotas registradas</div>
        ) : (
          filteredFees.map(fee => {
            const statusStyle = getStatusColor(fee.status);
            return (
              <div key={fee.id} style={styles.card}>
                <div style={styles.cardLeft}>
                  <p style={styles.monthText}>{MONTHS[fee.month - 1]} {fee.year}</p>
                  <p style={styles.amountText}>${fee.amount.toLocaleString('es-AR')}</p>
                  <p style={styles.dateText}>
                    Vto: {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString('es-AR') : '-'}
                  </p>
                </div>
                <div style={styles.cardRight}>
                  <div style={{ ...styles.badge, backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                    {statusStyle.label}
                  </div>
                  {(fee.status === 'PENDING' || fee.status === 'OVERDUE') && (
                    <button style={styles.payBtn} onClick={() => handlePay(fee.id)}>Pagar</button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
