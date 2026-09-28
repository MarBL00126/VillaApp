import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { theme } from '../theme';

type ResourceKey = 'stadium-info' | 'stadium-sectors' | 'stadium-services';

const RESOURCES: { key: ResourceKey; label: string }[] = [
  { key: 'stadium-info', label: 'Info general' },
  { key: 'stadium-sectors', label: 'Sectores' },
  { key: 'stadium-services', label: 'Servicios' },
];

export function StadiumAdminScreen() {
  const [resource, setResource] = useState<ResourceKey>('stadium-info');
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [json, setJson] = useState('{}');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async (nextResource = resource) => {
    setError('');
    try {
      const data = await adminService.getResourceRows(nextResource);
      setRows(data);
      setSelectedId(null);
      setJson('{}');
    } catch {
      setError('No se pudo cargar el recurso del estadio.');
    }
  };

  useEffect(() => {
    load(resource);
  }, [resource]);

  const selectRow = (row: Record<string, unknown>) => {
    setSelectedId(typeof row.id === 'number' ? row.id : null);
    setJson(JSON.stringify(row, null, 2));
  };

  const save = async () => {
    setError('');
    setMessage('');
    try {
      const parsed = JSON.parse(json) as Record<string, unknown>;
      if (selectedId === null) {
        await adminService.createResourceRow(resource, parsed);
      } else {
        await adminService.updateResourceRow(resource, selectedId, parsed);
      }
      await load(resource);
      setMessage('Estadio actualizado.');
    } catch {
      setError('No se pudo guardar. Revisa que el JSON sea valido.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Admin</p>
          <h1 style={styles.title}>Estadio</h1>
        </div>
        <select value={resource} onChange={(event) => setResource(event.target.value as ResourceKey)} style={styles.input}>
          {RESOURCES.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
        </select>
      </div>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>Registros</h2>
          <button type="button" style={styles.primaryBtn} onClick={() => { setSelectedId(null); setJson('{}'); }}>Nuevo</button>
          <div style={styles.list}>
            {rows.map((row, index) => (
              <button key={String(row.id ?? index)} type="button" style={styles.rowBtn} onClick={() => selectRow(row)}>
                <strong>{String(row.name ?? row.title ?? `Registro ${index + 1}`)}</strong>
                <span style={styles.muted}>ID {String(row.id ?? '-')}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>{selectedId === null ? 'Crear' : `Editar ID ${selectedId}`}</h2>
          <textarea value={json} onChange={(event) => setJson(event.target.value)} spellCheck={false} style={styles.editor} />
          <div style={styles.actions}>
            <button type="button" style={styles.primaryBtn} onClick={save}>Guardar</button>
            {selectedId !== null && (
              <button
                type="button"
                style={styles.dangerBtn}
                onClick={async () => {
                  await adminService.deleteResourceRow(resource, selectedId);
                  await load(resource);
                }}
              >
                Eliminar
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' },
  kicker: { margin: 0, color: theme.colors.secondary, fontWeight: 800 },
  title: { margin: 0, color: theme.colors.text, fontSize: theme.fontSizes.title },
  grid: { display: 'grid', gridTemplateColumns: 'minmax(260px, 360px) 1fr', gap: '1rem', alignItems: 'start' },
  panel: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, padding: '1rem', boxShadow: theme.shadows.card },
  panelTitle: { margin: '0 0 0.75rem', color: theme.colors.text },
  input: { padding: '0.65rem', borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}` },
  list: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' },
  rowBtn: { textAlign: 'left', border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.background, padding: '0.75rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  muted: { color: theme.colors.textMuted, fontSize: theme.fontSizes.xs },
  editor: { width: '100%', minHeight: '480px', boxSizing: 'border-box', border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, padding: '0.75rem', fontFamily: 'Consolas, Monaco, monospace', fontSize: theme.fontSizes.xs },
  actions: { display: 'flex', gap: '0.75rem', marginTop: '0.75rem' },
  primaryBtn: { border: 'none', borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.primary, color: theme.colors.white, padding: '0.65rem 0.9rem', fontWeight: 800, cursor: 'pointer' },
  dangerBtn: { border: `1px solid ${theme.colors.error}`, borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.surface, color: theme.colors.error, padding: '0.65rem 0.9rem', fontWeight: 800, cursor: 'pointer' },
  success: { color: '#047857', backgroundColor: '#d1fae5', borderRadius: theme.borderRadius.md, padding: '0.75rem' },
  error: { color: theme.colors.error, backgroundColor: '#fee2e2', borderRadius: theme.borderRadius.md, padding: '0.75rem' },
};
