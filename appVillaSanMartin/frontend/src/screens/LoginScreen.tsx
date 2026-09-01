import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';

export function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch {
      setError('Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.clubName}>Villa San Martín</h1>
          <p style={styles.subtitle}>Iniciá sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p style={styles.footer}>
          ¿No tenés cuenta?{' '}
          <Link to="/register" style={styles.link}>
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: theme.colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: theme.shadows.elevated,
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  clubName: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.title,
    fontWeight: 700,
    margin: 0,
  },
  subtitle: {
    color: theme.colors.textMuted,
    marginTop: '0.5rem',
    fontSize: theme.fontSizes.sm,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 600,
    color: theme.colors.text,
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    fontSize: theme.fontSizes.md,
    outline: 'none',
    color: theme.colors.text,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.fontSizes.sm,
    margin: 0,
  },
  button: {
    backgroundColor: theme.colors.secondary,
    color: theme.colors.primary,
    fontWeight: 700,
    fontSize: theme.fontSizes.md,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    padding: '0.875rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.sm,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: 600,
    textDecoration: 'none',
  },
};
