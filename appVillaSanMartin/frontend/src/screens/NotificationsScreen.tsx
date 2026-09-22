import React, { useEffect, useState } from 'react';
import { theme } from '../theme';
import { membershipService } from '../services/membershipService';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)} días`;
}

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    membershipService.getNotifications()
      .then(res => setNotifications(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id: number) => {
    try {
      await membershipService.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await membershipService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEWS': return '📰';
      case 'VIDEO': return '🎥';
      case 'FEE': return '💳';
      case 'BENEFIT': return '🎁';
      case 'REWARD': return '🏆';
      case 'RESULT': return '🏀';
      case 'POLL': return '📊';
      default: return '🔔';
    }
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '20px',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    titleWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    title: {
      margin: 0,
      color: theme.colors.primary,
    },
    badge: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.primary,
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '12px',
    },
    markAllBtn: {
      background: 'none',
      border: 'none',
      color: theme.colors.primary,
      textDecoration: 'underline',
      cursor: 'pointer',
      fontSize: theme.fontSizes.sm,
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: '15px',
      boxShadow: theme.shadows.card,
      display: 'flex',
      gap: '15px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    iconWrap: {
      fontSize: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
    },
    notiTitle: {
      margin: '0 0 5px 0',
      fontSize: theme.fontSizes.md,
    },
    notiMsg: {
      margin: 0,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textMuted,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    timeStr: {
      fontSize: '11px',
      color: theme.colors.textMuted,
      marginTop: '5px',
    },
    empty: {
      textAlign: 'center',
      color: theme.colors.textMuted,
      marginTop: '40px',
    }
  };

  if (loading) return <div style={styles.container}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div style={styles.titleWrapper}>
          <h2 style={styles.title}>Notificaciones</h2>
          {unreadCount > 0 && <div style={styles.badge}>{unreadCount}</div>}
        </div>
        {unreadCount > 0 && (
          <button style={styles.markAllBtn} onClick={handleMarkAllRead}>
            Marcar todas como leídas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={styles.empty}>🔔 No tenés notificaciones</div>
      ) : (
        <div style={styles.list}>
          {notifications.map(n => (
            <div 
              key={n.id} 
              style={{
                ...styles.card,
                backgroundColor: n.isRead ? theme.colors.surface : '#fffbeb',
                borderLeft: n.isRead ? 'none' : `4px solid ${theme.colors.secondary}`
              }}
              onClick={() => { if (!n.isRead) handleMarkRead(n.id); }}
            >
              <div style={styles.iconWrap}>{getIcon(n.type)}</div>
              <div style={styles.content}>
                <h4 style={{ ...styles.notiTitle, fontWeight: n.isRead ? 'normal' : 'bold' }}>
                  {n.title}
                </h4>
                <p style={styles.notiMsg}>{n.message}</p>
                <div style={styles.timeStr}>{timeAgo(n.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
