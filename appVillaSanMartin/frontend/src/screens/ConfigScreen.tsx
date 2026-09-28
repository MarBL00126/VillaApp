import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { theme } from '../theme';
import type { AppConfig } from '../types';

export function ConfigScreen() {
  const [items, setItems] = useState<AppConfig[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const rows = await adminService.getConfig();
      setItems(rows);
      setDrafts(Object.fromEntries(rows.map((item) => [item.key, item.value])));
    } catch {
      setError('No se pudo cargar la configuracion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (item: AppConfig) => {
    setError('');
    setMessage('');
    try {
      const saved = await adminService.setConfigValue(item.key, drafts[item.key] ?? item.value);
      setItems((current) => current.map((row) => (row.id === saved.id ? saved : row)));
      setMessage('Configuracion actualizada.');
    } catch {
      setError('No se pudo guardar el valor.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Admin</p>
          <h1 style={styles.title}>Configuracion</h1>
        </div>
        <button type="button" onClick={load} style={styles.secondaryBtn}>Actualizar</button>
      </div>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {items.length === 0 ? (
        <EmptyState message="No hay configuraciones cargadas" />
      ) : (
        <div style={styles.list}>
          {items.map((item) => (
            <article key={item.id} style={styles.card}>
              <div style={styles.cardInfo}>
                <strong>{item.key}</strong>
                <span style={styles.muted}>{item.type} · {item.description || 'Sin descripcion'}</span>
              </div>
              <input
                value={drafts[item.key] ?? ''}
                onChange={(event) => setDrafts((current) => ({ ...current, [item.key]: event.target.value }))}
                style={styles.input}
              />
              <button type="button" onClick={() => save(item)} style={styles.primaryBtn}>Guardar</button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' },
  kicker: { margin: 0, color: theme.colors.secondary, fontWeight: 800 },
  title: { margin: 0, color: theme.colors.text, fontSize: theme.fontSizes.title },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  card: {
    display: 'grid',
    gridTemplateColumns: 'minmax(220px, 1fr) minmax(180px, 320px) auto',
    gap: '0.75rem',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: '1rem',
    boxShadow: theme.shadows.card,
  },
  cardInfo: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  muted: { color: theme.colors.textMuted, fontSize: theme.fontSizes.xs },
  input: { padding: '0.65rem', borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}` },
  primaryBtn: { border: 'none', borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.primary, color: theme.colors.white, padding: '0.65rem 0.9rem', fontWeight: 800, cursor: 'pointer' },
  secondaryBtn: { border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.surface, color: theme.colors.primary, padding: '0.65rem 0.9rem', fontWeight: 700, cursor: 'pointer' },
  success: { color: '#047857', backgroundColor: '#d1fae5', borderRadius: theme.borderRadius.md, padding: '0.75rem' },
  error: { color: theme.colors.error, backgroundColor: '#fee2e2', borderRadius: theme.borderRadius.md, padding: '0.75rem' },
};
