// Colores y tema del Club Villa San Martín
export const theme = {
  colors: {
    primary: '#0d1f4e',       // Azul oscuro del club
    secondary: '#f5a623',     // Dorado
    background: '#f4f6fa',
    surface: '#ffffff',
    text: '#1a1a2e',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    error: '#dc2626',
    success: '#16a34a',
    white: '#ffffff',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    title: '2rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    card: '0 2px 8px rgba(0, 0, 0, 0.08)',
    elevated: '0 4px 16px rgba(0, 0, 0, 0.12)',
  },
} as const;

export type Theme = typeof theme;
