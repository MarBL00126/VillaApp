import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';

export function RegisterScreen() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch {
      setError('No se pudo registrar. Verificá que el email no esté en uso.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.clubName}>Villa San Martín</h1>
          <p style={styles.subtitle}>Creá tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Nombre</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Juan"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Apellido</label>
              <input
                name="surname"
                value={form.surname}
                onChange={handleChange}
                style={styles.input}
                placeholder="Pérez"
                required
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Teléfono</label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              style={styles.input}
              placeholder="+54 9 11 1234-5678"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <p style={styles.footer}>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" style={styles.link}>
            Ingresá
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
    maxWidth: '460px',
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
  row: {
    display: 'flex',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    flex: 1,
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
    width: '100%',
    boxSizing: 'border-box',
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
