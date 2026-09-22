import { Outlet, NavLink } from 'react-router-dom';
import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { path: '/', label: 'Inicio', end: true },
  { path: '/players', label: 'Plantel', end: false },
  { path: '/fixture', label: 'Fixture', end: false },
  { path: '/news', label: 'Noticias', end: false },
  { path: '/cantina', label: 'Cantina', end: false },
  { path: '/shop', label: 'Tienda', end: false },
  { path: '/media', label: 'Multimedia', end: false },
  { path: '/stats', label: 'Stats', end: false },
  { path: '/membership', label: 'Membresía', end: false },
  { path: '/game', label: 'Juego', end: false },
  { path: '/rewards', label: 'Rewards', end: false },
  { path: '/community', label: 'Comunidad', end: false },
  { path: '/team', label: 'Cuerpo Técnico', end: false },
  { path: '/notifications', label: '🔔', end: false },
  { path: '/profile', label: 'Perfil', end: false },
];

export function Layout() {
  const { user } = useAuth();
  const visibleItems = user?.role === 'ADMIN'
    ? [...navItems, { path: '/admin', label: 'Admin', end: false }]
    : navItems;

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <span style={styles.brand}>🏀 VSM</span>
        <nav style={styles.nav}>
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              style={({ isActive }) =>
                isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: '0 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '56px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: theme.shadows.elevated,
    gap: '15px'
  },
  brand: {
    color: theme.colors.secondary,
    fontWeight: 700,
    fontSize: theme.fontSizes.lg,
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap'
  },
  nav: {
    display: 'flex',
    gap: '0.25rem',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE and Edge
    WebkitOverflowScrolling: 'touch',
    flex: 1,
    paddingRight: '1rem',
  },
  navLink: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    padding: '0.4rem 0.75rem',
    borderRadius: theme.borderRadius.md,
    transition: 'all 0.15s',
  } as React.CSSProperties,
  activeLink: {
    color: theme.colors.secondary,
    backgroundColor: 'rgba(245,166,35,0.15)',
    fontWeight: 700,
  },
  main: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0', // Adjust as some screens specify their own padding
  },
};
