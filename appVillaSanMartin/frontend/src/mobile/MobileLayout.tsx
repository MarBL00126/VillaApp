import { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type NavItem = {
  path: string;
  label: string;
  shortLabel?: string;
  icon: string;
  end: boolean;
  mobilePrimary?: boolean;
};

const navItems: NavItem[] = [
  { path: '/', label: 'Inicio', icon: 'I', end: true, mobilePrimary: true },
  { path: '/fixture', label: 'Fixture', icon: 'F', end: false, mobilePrimary: true },
  { path: '/news', label: 'Noticias', icon: 'N', end: false, mobilePrimary: true },
  { path: '/shop', label: 'Tienda', icon: 'T', end: false, mobilePrimary: true },
  { path: '/players', label: 'Plantel', icon: 'P', end: false },
  { path: '/cantina', label: 'Cantina', icon: 'C', end: false },
  { path: '/stadium', label: 'Estadio', icon: 'E', end: false },
  { path: '/media', label: 'Multimedia', shortLabel: 'Media', icon: 'M', end: false },
  { path: '/stats', label: 'Stats', icon: 'S', end: false },
  { path: '/standings', label: 'Posiciones', shortLabel: 'Tabla', icon: 'X', end: false },
  { path: '/stats/leaders', label: 'Lideres', icon: 'L', end: false },
  { path: '/press/request', label: 'Solicitar prensa', shortLabel: 'Prensa', icon: 'Q', end: false },
  { path: '/press/my', label: 'Mis acreditaciones', shortLabel: 'Acred.', icon: 'Y', end: false },
  { path: '/membership', label: 'Membresia', shortLabel: 'Socios', icon: 'O', end: false },
  { path: '/benefits', label: 'Beneficios', icon: 'B', end: false },
  { path: '/game', label: 'Juego', icon: 'J', end: false },
  { path: '/rewards', label: 'Rewards', shortLabel: 'Puntos', icon: 'R', end: false },
  { path: '/community', label: 'Comunidad', icon: 'U', end: false },
  { path: '/team', label: 'Cuerpo Tecnico', shortLabel: 'Staff', icon: 'D', end: false },
  { path: '/notifications', label: 'Notificaciones', shortLabel: 'Avisos', icon: 'A', end: false },
  { path: '/profile', label: 'Perfil', icon: 'K', end: false },
];

function isActivePath(pathname: string, item: NavItem) {
  if (item.end) return pathname === item.path;
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}

export function MobileLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleItems = useMemo(() => {
    const items = user?.role === 'ADMIN'
      ? [
          ...navItems,
          { path: '/admin', label: 'Admin', icon: 'G', end: false },
          { path: '/admin/access/scan', label: 'Escanear accesos', shortLabel: 'Scan', icon: 'V', end: false },
          { path: '/admin/press', label: 'Prensa admin', shortLabel: 'Prensa+', icon: 'Z', end: false },
          { path: '/admin/config', label: 'Config admin', shortLabel: 'Config', icon: 'W', end: false },
          { path: '/admin/stadium', label: 'Estadio admin', shortLabel: 'Estadio+', icon: 'H', end: false },
        ]
      : navItems;

    return items;
  }, [user?.role]);

  const primaryItems = visibleItems.filter((item) => item.mobilePrimary);
  const overflowItems = visibleItems.filter((item) => !item.mobilePrimary);
  const isOverflowActive = overflowItems.some((item) => isActivePath(location.pathname, item));

  return (
    <div className="mobile-app-shell">
      <header className="mobile-app-header">
        <NavLink to="/" className="mobile-app-brand" onClick={() => setMenuOpen(false)}>
          <span className="mobile-app-brand-mark">VSM</span>
          <span className="mobile-app-brand-text">Villa San Martin</span>
        </NavLink>
      </header>

      <main className="mobile-app-main">
        <Outlet />
      </main>

      {menuOpen && (
        <button
          className="mobile-menu-backdrop"
          type="button"
          aria-label="Cerrar menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {menuOpen && (
        <aside id="mobile-more-panel" className="mobile-more-panel open" aria-label="Mas secciones">
          <div className="mobile-more-handle" />
          <div className="mobile-more-header">
            <span>Mas secciones</span>
            <button type="button" onClick={() => setMenuOpen(false)} className="mobile-more-close">
              Cerrar
            </button>
          </div>
          <nav className="mobile-more-grid">
            {overflowItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'mobile-more-link active' : 'mobile-more-link')}
              >
                <span className="mobile-nav-icon">{item.icon}</span>
                <span>{item.shortLabel ?? item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
      )}

      <nav className="mobile-tabbar" aria-label="Navegacion mobile">
        {primaryItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => (isActive ? 'mobile-tab active' : 'mobile-tab')}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span>{item.shortLabel ?? item.label}</span>
          </NavLink>
        ))}

        <button
          type="button"
          className={menuOpen || isOverflowActive ? 'mobile-tab active' : 'mobile-tab'}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-more-panel"
        >
          <span className="mobile-nav-icon">+</span>
          <span>Mas</span>
        </button>
      </nav>
    </div>
  );
}
