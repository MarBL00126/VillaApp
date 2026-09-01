import { Outlet, NavLink } from 'react-router-dom';
import { theme } from '../theme';

const navItems = [
  { path: '/', label: 'Inicio', end: true },
  { path: '/players', label: 'Plantel', end: false },
  { path: '/fixture', label: 'Fixture', end: false },
  { path: '/stats', label: 'Stats', end: false },
  { path: '/profile', label: 'Perfil', end: false },
];

export function Layout() {
  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <span style={styles.brand}>🏀 VSM</span>
        <nav style={styles.nav}>
          {navItems.map((item) => (
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
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '56px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: theme.shadows.elevated,
  },
  brand: {
    color: theme.colors.secondary,
    fontWeight: 700,
    fontSize: theme.fontSizes.lg,
    letterSpacing: '0.05em',
  },
  nav: {
    display: 'flex',
    gap: '0.25rem',
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
    padding: '1.5rem 1rem',
  },
};
