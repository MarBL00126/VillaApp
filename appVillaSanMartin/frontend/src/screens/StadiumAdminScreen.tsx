import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { theme } from '../theme';

type ResourceKey = 'stadium-info' | 'stadium-sectors' | 'stadium-services';

const RESOURCES: { key: ResourceKey; label: string }[] = [
  { key: 'stadium-info', label: 'Info general' },
  { key: 'stadium-sectors', label: 'Sectores' },
  { key: 'stadium-services', label: 'Servicios' },
];

const DRAFTS: Record<ResourceKey, Record<string, unknown>> = {
  'stadium-info': { name: '', address: '', city: '', capacity: 0, mapUrl: '', parkingUrl: '', latitude: 0, longitude: 0 },
  'stadium-sectors': { name: '', type: '', gate: '', capacity: 0, colorHex: '', description: '', active: true },
  'stadium-services': { name: '', type: '', location: '', active: true, sector: { id: 0 } },
};

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
      setJson(emptyDraft(nextResource));
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
      setError('No se pudo guardar. Revisa los campos e intenta de nuevo.');
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
          <button type="button" style={styles.primaryBtn} onClick={() => { setSelectedId(null); setJson(emptyDraft(resource)); }}>Nuevo</button>
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
          <FieldEditor value={json} onChange={setJson} />
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

function emptyDraft(resource: ResourceKey) {
  return JSON.stringify(DRAFTS[resource], null, 2);
}

function parseDraft(value: string) {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function updateField(value: string, field: string, nextValue: unknown) {
  const parsed = parseDraft(value);
  return JSON.stringify({ ...parsed, [field]: nextValue }, null, 2);
}

function updateRelation(value: string, field: string, id: number) {
  const parsed = parseDraft(value);
  const current = parsed[field];
  const relation = current && typeof current === 'object' && !Array.isArray(current) ? current as Record<string, unknown> : {};
  return JSON.stringify({ ...parsed, [field]: { ...relation, id } }, null, 2);
}

function labelFor(field: string) {
  const labels: Record<string, string> = {
    active: 'Activo',
    address: 'Direccion',
    capacity: 'Capacidad',
    city: 'Ciudad',
    colorHex: 'Color',
    description: 'Descripcion',
    gate: 'Puerta',
    latitude: 'Latitud',
    location: 'Ubicacion',
    longitude: 'Longitud',
    mapUrl: 'Mapa',
    name: 'Nombre',
    parkingUrl: 'Estacionamiento',
    sector: 'Sector',
    type: 'Tipo',
  };
  return labels[field] ?? field;
}

function FieldEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const data = parseDraft(value);
  const entries = Object.entries(data).filter(([field]) => field !== 'id' && field !== 'updatedAt');

  if (entries.length === 0) {
    return <p style={styles.muted}>Selecciona un registro o crea uno nuevo para completar sus datos.</p>;
  }

  return (
    <div style={styles.fields}>
      {entries.map(([field, fieldValue]) => {
        const label = labelFor(field);
        if (typeof fieldValue === 'boolean') {
          return (
            <label key={field} style={styles.checkboxLabel}>
              <input type="checkbox" checked={fieldValue} onChange={(event) => onChange(updateField(value, field, event.target.checked))} />
              {label}
            </label>
          );
        }
        if (fieldValue && typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
          const relation = fieldValue as Record<string, unknown>;
          const id = typeof relation.id === 'number' ? relation.id : 0;
          return (
            <label key={field} style={styles.label}>
              {label} relacionado
              <input type="number" style={styles.input} value={id} onChange={(event) => onChange(updateRelation(value, field, Number(event.target.value)))} />
            </label>
          );
        }
        if (typeof fieldValue === 'number') {
          return (
            <label key={field} style={styles.label}>
              {label}
              <input type="number" step={field === 'latitude' || field === 'longitude' ? '0.0000001' : '1'} style={styles.input} value={fieldValue} onChange={(event) => onChange(updateField(value, field, Number(event.target.value)))} />
            </label>
          );
        }
        const text = fieldValue === null ? '' : String(fieldValue);
        if (field === 'description') {
          return (
            <label key={field} style={styles.label}>
              {label}
              <textarea style={styles.textarea} value={text} onChange={(event) => onChange(updateField(value, field, event.target.value))} />
            </label>
          );
        }
        return (
          <label key={field} style={styles.label}>
            {label}
            <input style={styles.input} value={text} onChange={(event) => onChange(updateField(value, field, event.target.value))} />
          </label>
        );
      })}
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
  fields: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.35rem', color: theme.colors.textMuted, fontSize: theme.fontSizes.xs, fontWeight: 700 },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.colors.text, fontSize: theme.fontSizes.sm },
  input: { padding: '0.65rem', borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}` },
  textarea: { minHeight: '90px', padding: '0.65rem', borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}`, resize: 'vertical' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' },
  rowBtn: { textAlign: 'left', border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.background, padding: '0.75rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  muted: { color: theme.colors.textMuted, fontSize: theme.fontSizes.xs },
  actions: { display: 'flex', gap: '0.75rem', marginTop: '0.75rem' },
  primaryBtn: { border: 'none', borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.primary, color: theme.colors.white, padding: '0.65rem 0.9rem', fontWeight: 800, cursor: 'pointer' },
  dangerBtn: { border: `1px solid ${theme.colors.error}`, borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.surface, color: theme.colors.error, padding: '0.65rem 0.9rem', fontWeight: 800, cursor: 'pointer' },
  success: { color: '#047857', backgroundColor: '#d1fae5', borderRadius: theme.borderRadius.md, padding: '0.75rem' },
  error: { color: theme.colors.error, backgroundColor: '#fee2e2', borderRadius: theme.borderRadius.md, padding: '0.75rem' },
};
