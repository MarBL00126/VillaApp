import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';

const ROLE_LABELS: Record<string, string> = {
  USER: 'Usuario',
  ADMIN: 'Administrador',
  PLAYER: 'Jugador',
};

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  return (
    <div>
      <h1 style={styles.title}>Mi Perfil</h1>

      <div style={styles.card}>
        <div style={styles.avatar}>
          <span style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</span>
        </div>
        <div style={styles.info}>
          <p style={styles.name}>{user.name}</p>
          <p style={styles.email}>{user.email}</p>
          <span style={styles.roleBadge}>{ROLE_LABELS[user.role] ?? user.role}</span>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Club</h2>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Club</span>
          <span style={styles.infoValue}>Villa San Martín</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Deporte</span>
          <span style={styles.infoValue}>Baloncesto</span>
        </div>
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        Cerrar sesión
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  title: { margin: '0 0 1.5rem', color: theme.colors.text, fontSize: theme.fontSizes.xxl, fontWeight: 700 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: '1.5rem',
    boxShadow: theme.shadows.card,
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: theme.colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { color: theme.colors.secondary, fontWeight: 700, fontSize: '1.75rem' },
  info: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  name: { margin: 0, fontWeight: 700, fontSize: theme.fontSizes.xl, color: theme.colors.text },
  email: { margin: 0, color: theme.colors.textMuted, fontSize: theme.fontSizes.sm },
  roleBadge: {
    display: 'inline-block',
    backgroundColor: theme.colors.secondary,
    color: theme.colors.primary,
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    padding: '0.15rem 0.6rem',
    borderRadius: theme.borderRadius.full,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: '1.25rem',
    boxShadow: theme.shadows.card,
    border: `1px solid ${theme.colors.border}`,
    marginBottom: '1.5rem',
  },
  sectionTitle: { margin: '0 0 1rem', fontSize: theme.fontSizes.md, fontWeight: 700, color: theme.colors.text },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  infoLabel: { color: theme.colors.textMuted, fontSize: theme.fontSizes.sm },
  infoValue: { fontWeight: 600, color: theme.colors.text, fontSize: theme.fontSizes.sm },
  logoutBtn: {
    width: '100%',
    padding: '0.875rem',
    backgroundColor: theme.colors.error,
    color: theme.colors.white,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    fontWeight: 700,
    fontSize: theme.fontSizes.md,
    cursor: 'pointer',
  },
};
