import React, { useEffect, useState } from 'react';
import { theme } from '../theme';
import { membershipService } from '../services/membershipService';

export function TeamProfileScreen() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    membershipService.getStaff()
      .then(res => setStaff(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '20px',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    header: {
      color: theme.colors.primary,
      borderBottom: `2px solid ${theme.colors.secondary}`,
      paddingBottom: '10px',
      marginBottom: '20px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '20px',
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: '20px',
      boxShadow: theme.shadows.card,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '15px',
    },
    name: {
      margin: '0 0 5px 0',
      fontSize: theme.fontSizes.lg,
      color: theme.colors.text,
    },
    roleBadge: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.primary,
      padding: '4px 12px',
      borderRadius: theme.borderRadius.full,
      fontSize: theme.fontSizes.sm,
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    bio: {
      margin: 0,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.textMuted,
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
      <h2 style={styles.header}>Cuerpo Técnico</h2>
      
      {staff.length === 0 ? (
        <div style={styles.empty}>No hay información del cuerpo técnico disponible</div>
      ) : (
        <div style={styles.grid}>
          {staff.map(member => (
            <div key={member.id} style={styles.card}>
              <div style={styles.avatar}>{getInitials(member.name)}</div>
              <h3 style={styles.name}>{member.name}</h3>
              <div style={styles.roleBadge}>{member.role}</div>
              {member.bio && (
                <p style={styles.bio}>
                  {member.bio.length > 100 ? member.bio.substring(0, 100) + '...' : member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
