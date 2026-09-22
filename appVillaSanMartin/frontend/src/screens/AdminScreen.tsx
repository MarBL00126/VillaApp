import { useEffect, useState } from 'react';
import { theme } from '../theme';
import type { CantinaMenuCategory, CantinaMenuItem, Match, Player } from '../types';
import { adminService, type AdminResourceInfo, type CategoryPayload, type MatchPayload, type MenuItemPayload, type PlayerPayload } from '../services/adminService';

type Tab = 'players' | 'matches' | 'cantina' | 'advanced';

const nowForInput = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

const emptyPlayer = (): PlayerPayload => ({
  name: '',
  surname: '',
  position: 'Base',
  shirtNumber: 0,
  height: 0,
  nationality: 'Argentina',
  birthDate: '2000-01-01',
  biography: '',
  imageUrl: '',
  active: true,
});

const emptyMatch = (): MatchPayload => ({
  matchDate: nowForInput(),
  isLocal: true,
  opponent: '',
  teamPoints: 0,
  opponentPoints: 0,
});

const emptyCategory = (): CategoryPayload => ({ name: '', sortOrder: 0 });

const emptyItem = (): MenuItemPayload => ({
  categoryId: 0,
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  available: true,
});

export function AdminScreen() {
  const [tab, setTab] = useState<Tab>('players');
  const [dashboard, setDashboard] = useState<Record<string, number>>({});
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [categories, setCategories] = useState<CantinaMenuCategory[]>([]);
  const [items, setItems] = useState<CantinaMenuItem[]>([]);
  const [resources, setResources] = useState<AdminResourceInfo[]>([]);
  const [selectedResource, setSelectedResource] = useState('');
  const [resourceRows, setResourceRows] = useState<Record<string, unknown>[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);
  const [resourceJson, setResourceJson] = useState('{}');
  const [resourceLoading, setResourceLoading] = useState(false);
  const [playerForm, setPlayerForm] = useState<PlayerPayload>(emptyPlayer);
  const [matchForm, setMatchForm] = useState<MatchPayload>(emptyMatch);
  const [categoryForm, setCategoryForm] = useState<CategoryPayload>(emptyCategory);
  const [itemForm, setItemForm] = useState<MenuItemPayload>(emptyItem);
  const [editingPlayerId, setEditingPlayerId] = useState<number | undefined>();
  const [editingMatchId, setEditingMatchId] = useState<number | undefined>();
  const [editingCategoryId, setEditingCategoryId] = useState<number | undefined>();
  const [editingItemId, setEditingItemId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    setError('');
    const [summary, playerRows, matchRows, categoryRows, itemRows, resourceRows] = await Promise.all([
      adminService.getDashboard(),
      adminService.getPlayers(),
      adminService.getMatches(),
      adminService.getCantinaCategories(),
      adminService.getCantinaItems(),
      adminService.getResources(),
    ]);
    setDashboard(summary);
    setPlayers(playerRows);
    setMatches([...matchRows].sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()));
    setCategories(categoryRows);
    setItems(itemRows);
    setResources(resourceRows);
    if (!selectedResource && resourceRows.length > 0) {
      setSelectedResource(resourceRows[0].key);
    }
    if (categoryRows.length > 0) {
      setItemForm((current) => ({ ...current, categoryId: current.categoryId || categoryRows[0].id }));
    }
  };

  const loadResourceRows = async (resource = selectedResource) => {
    if (!resource) return;
    setResourceLoading(true);
    setError('');
    try {
      const rows = await adminService.getResourceRows(resource);
      setResourceRows(rows);
      setSelectedResourceId(null);
      setResourceJson('{}');
    } catch {
      setError('No se pudo cargar el recurso seleccionado.');
    } finally {
      setResourceLoading(false);
    }
  };

  useEffect(() => {
    loadData()
      .catch(() => setError('No se pudo cargar el panel admin. Verifica que tu usuario tenga rol ADMIN.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedResource) {
      loadResourceRows(selectedResource);
    }
  }, [selectedResource]);

  const refreshAfterSave = async (text: string) => {
    await loadData();
    setMessage(text);
    setTimeout(() => setMessage(''), 2500);
  };

  const savePlayer = async () => {
    setError('');
    await adminService.savePlayer(playerForm, editingPlayerId);
    setPlayerForm(emptyPlayer());
    setEditingPlayerId(undefined);
    await refreshAfterSave('Jugador guardado.');
  };

  const saveMatch = async () => {
    setError('');
    await adminService.saveMatch(matchForm, editingMatchId);
    setMatchForm(emptyMatch());
    setEditingMatchId(undefined);
    await refreshAfterSave('Partido guardado.');
  };

  const saveCategory = async () => {
    setError('');
    await adminService.saveCantinaCategory(categoryForm, editingCategoryId);
    setCategoryForm(emptyCategory());
    setEditingCategoryId(undefined);
    await refreshAfterSave('Categoria guardada.');
  };

  const saveItem = async () => {
    setError('');
    await adminService.saveCantinaItem(itemForm, editingItemId);
    setItemForm({ ...emptyItem(), categoryId: categories[0]?.id ?? 0 });
    setEditingItemId(undefined);
    await refreshAfterSave('Producto de cantina guardado.');
  };

  const editPlayer = (player: Player) => {
    setEditingPlayerId(player.id);
    setPlayerForm({
      name: player.name,
      surname: player.surname,
      position: player.position,
      shirtNumber: player.shirtNumber,
      height: player.height,
      nationality: player.nationality,
      birthDate: player.birthDate.slice(0, 10),
      teamId: player.team?.id,
      biography: player.biography ?? '',
      imageUrl: player.imageUrl ?? '',
      active: player.active ?? true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editMatch = (match: Match) => {
    setEditingMatchId(match.id);
    setMatchForm({
      matchDate: match.matchDate.slice(0, 16),
      isLocal: match.isLocal,
      opponent: match.opponent,
      teamPoints: match.teamPoints ?? 0,
      opponentPoints: match.opponentPoints ?? 0,
      teamId: match.team?.id,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editCategory = (category: CantinaMenuCategory) => {
    setEditingCategoryId(category.id);
    setCategoryForm({ name: category.name, sortOrder: category.sortOrder });
  };

  const editItem = (item: CantinaMenuItem) => {
    setEditingItemId(item.id);
    setItemForm({
      categoryId: item.category.id,
      name: item.name,
      description: item.description ?? '',
      price: item.price,
      imageUrl: item.imageUrl ?? '',
      available: item.available,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const run = async (action: () => Promise<unknown>) => {
    try {
      await action();
    } catch {
      setError('No se pudo guardar el cambio. Revisa los campos e intenta de nuevo.');
    }
  };

  const selectResourceRow = (row: Record<string, unknown>) => {
    const id = typeof row.id === 'number' ? row.id : null;
    setSelectedResourceId(id);
    setResourceJson(JSON.stringify(row, null, 2));
  };

  const saveResourceJson = async () => {
    setError('');
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(resourceJson) as Record<string, unknown>;
    } catch {
      setError('El JSON no es valido.');
      return;
    }
    if (selectedResourceId === null) {
      await adminService.createResourceRow(selectedResource, parsed);
    } else {
      await adminService.updateResourceRow(selectedResource, selectedResourceId, parsed);
    }
    await loadResourceRows();
    await refreshAfterSave('Recurso actualizado.');
  };

  if (loading) return <div style={styles.page}>Cargando panel admin...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Administracion</h1>
          <p style={styles.subtitle}>Gestion del plantel, partidos y cantina.</p>
        </div>
      </div>

      <div style={styles.summaryGrid}>
        <Summary label="Jugadores" value={dashboard.players} />
        <Summary label="Partidos" value={dashboard.matches} />
        <Summary label="Items cantina" value={dashboard.menuItems} />
        <Summary label="Categorias" value={dashboard.menuCategories} />
      </div>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(tab === 'players' ? styles.activeTab : {}) }} onClick={() => setTab('players')}>Plantel</button>
        <button style={{ ...styles.tab, ...(tab === 'matches' ? styles.activeTab : {}) }} onClick={() => setTab('matches')}>Partidos</button>
        <button style={{ ...styles.tab, ...(tab === 'cantina' ? styles.activeTab : {}) }} onClick={() => setTab('cantina')}>Cantina</button>
        <button style={{ ...styles.tab, ...(tab === 'advanced' ? styles.activeTab : {}) }} onClick={() => setTab('advanced')}>Avanzado</button>
      </div>

      {tab === 'players' && (
        <section>
          <div style={styles.form}>
            <h2 style={styles.sectionTitle}>{editingPlayerId ? 'Editar jugador' : 'Nuevo jugador'}</h2>
            <div style={styles.grid}>
              <TextInput label="Nombre" value={playerForm.name} onChange={(name) => setPlayerForm({ ...playerForm, name })} />
              <TextInput label="Apellido" value={playerForm.surname} onChange={(surname) => setPlayerForm({ ...playerForm, surname })} />
              <TextInput label="Posicion" value={playerForm.position} onChange={(position) => setPlayerForm({ ...playerForm, position })} />
              <NumberInput label="Camiseta" value={playerForm.shirtNumber} onChange={(shirtNumber) => setPlayerForm({ ...playerForm, shirtNumber })} />
              <NumberInput label="Altura" value={playerForm.height} step="0.01" onChange={(height) => setPlayerForm({ ...playerForm, height })} />
              <TextInput label="Nacionalidad" value={playerForm.nationality} onChange={(nationality) => setPlayerForm({ ...playerForm, nationality })} />
              <TextInput label="Nacimiento" type="date" value={playerForm.birthDate} onChange={(birthDate) => setPlayerForm({ ...playerForm, birthDate })} />
              <TextInput label="URL imagen" value={playerForm.imageUrl ?? ''} onChange={(imageUrl) => setPlayerForm({ ...playerForm, imageUrl })} />
            </div>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={playerForm.active} onChange={(event) => setPlayerForm({ ...playerForm, active: event.target.checked })} />
              Activo en el plantel
            </label>
            <label style={styles.label}>
              Biografia
              <textarea style={styles.textarea} value={playerForm.biography ?? ''} onChange={(event) => setPlayerForm({ ...playerForm, biography: event.target.value })} />
            </label>
            <div style={styles.actions}>
              <button style={styles.primaryBtn} onClick={() => run(savePlayer)}>Guardar jugador</button>
              {editingPlayerId && <button style={styles.secondaryBtn} onClick={() => { setEditingPlayerId(undefined); setPlayerForm(emptyPlayer()); }}>Cancelar</button>}
            </div>
          </div>

          <div style={styles.list}>
            {players.map((player) => (
              <div key={player.id} style={styles.row}>
                {player.imageUrl ? <img src={player.imageUrl} alt="" style={styles.thumb} /> : <div style={styles.thumbFallback}>#{player.shirtNumber}</div>}
                <div style={styles.rowMain}>
                  <strong>{player.name} {player.surname}</strong>
                  <span style={styles.muted}>{player.position} · #{player.shirtNumber} · {player.active ? 'Activo' : 'Cortado/inactivo'}</span>
                </div>
                <button style={styles.secondaryBtn} onClick={() => editPlayer(player)}>Editar</button>
                <button
                  style={player.active ? styles.dangerBtn : styles.secondaryBtn}
                  onClick={() => run(async () => {
                    await adminService.setPlayerActive(player.id, !(player.active ?? true));
                    await refreshAfterSave('Estado del jugador actualizado.');
                  })}
                >
                  {player.active ? 'Cortar' : 'Reactivar'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'matches' && (
        <section>
          <div style={styles.form}>
            <h2 style={styles.sectionTitle}>{editingMatchId ? 'Editar partido' : 'Nuevo partido'}</h2>
            <div style={styles.grid}>
              <TextInput label="Fecha y hora" type="datetime-local" value={matchForm.matchDate} onChange={(matchDate) => setMatchForm({ ...matchForm, matchDate })} />
              <TextInput label="Rival" value={matchForm.opponent} onChange={(opponent) => setMatchForm({ ...matchForm, opponent })} />
              <NumberInput label="Puntos Villa" value={matchForm.teamPoints} onChange={(teamPoints) => setMatchForm({ ...matchForm, teamPoints })} />
              <NumberInput label="Puntos rival" value={matchForm.opponentPoints} onChange={(opponentPoints) => setMatchForm({ ...matchForm, opponentPoints })} />
            </div>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={matchForm.isLocal} onChange={(event) => setMatchForm({ ...matchForm, isLocal: event.target.checked })} />
              Villa juega de local
            </label>
            <div style={styles.actions}>
              <button style={styles.primaryBtn} onClick={() => run(saveMatch)}>Guardar partido</button>
              {editingMatchId && <button style={styles.secondaryBtn} onClick={() => { setEditingMatchId(undefined); setMatchForm(emptyMatch()); }}>Cancelar</button>}
            </div>
          </div>

          <div style={styles.list}>
            {matches.map((match) => (
              <div key={match.id} style={styles.row}>
                <div style={styles.rowMain}>
                  <strong>{match.isLocal ? 'Local' : 'Visitante'} vs {match.opponent}</strong>
                  <span style={styles.muted}>{new Date(match.matchDate).toLocaleString('es-AR')} · {match.teamPoints}-{match.opponentPoints}</span>
                </div>
                <button style={styles.secondaryBtn} onClick={() => editMatch(match)}>Editar</button>
                <button style={styles.dangerBtn} onClick={() => run(async () => { await adminService.deleteMatch(match.id); await refreshAfterSave('Partido eliminado.'); })}>Eliminar</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'cantina' && (
        <section>
          <div style={styles.split}>
            <div style={styles.form}>
              <h2 style={styles.sectionTitle}>{editingCategoryId ? 'Editar categoria' : 'Nueva categoria'}</h2>
              <TextInput label="Nombre" value={categoryForm.name} onChange={(name) => setCategoryForm({ ...categoryForm, name })} />
              <NumberInput label="Orden" value={categoryForm.sortOrder} onChange={(sortOrder) => setCategoryForm({ ...categoryForm, sortOrder })} />
              <div style={styles.actions}>
                <button style={styles.primaryBtn} onClick={() => run(saveCategory)}>Guardar categoria</button>
                {editingCategoryId && <button style={styles.secondaryBtn} onClick={() => { setEditingCategoryId(undefined); setCategoryForm(emptyCategory()); }}>Cancelar</button>}
              </div>
              <div style={styles.compactList}>
                {categories.map((category) => (
                  <button key={category.id} style={styles.compactRow} onClick={() => editCategory(category)}>
                    {category.sortOrder}. {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.form}>
              <h2 style={styles.sectionTitle}>{editingItemId ? 'Editar item' : 'Nuevo item'}</h2>
              <label style={styles.label}>
                Categoria
                <select style={styles.input} value={itemForm.categoryId} onChange={(event) => setItemForm({ ...itemForm, categoryId: Number(event.target.value) })}>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
              <TextInput label="Nombre" value={itemForm.name} onChange={(name) => setItemForm({ ...itemForm, name })} />
              <TextInput label="Descripcion" value={itemForm.description ?? ''} onChange={(description) => setItemForm({ ...itemForm, description })} />
              <NumberInput label="Precio" value={itemForm.price} step="0.01" onChange={(price) => setItemForm({ ...itemForm, price })} />
              <TextInput label="URL imagen" value={itemForm.imageUrl ?? ''} onChange={(imageUrl) => setItemForm({ ...itemForm, imageUrl })} />
              <label style={styles.checkboxLabel}>
                <input type="checkbox" checked={itemForm.available} onChange={(event) => setItemForm({ ...itemForm, available: event.target.checked })} />
                Disponible
              </label>
              <div style={styles.actions}>
                <button style={styles.primaryBtn} onClick={() => run(saveItem)}>Guardar item</button>
                {editingItemId && <button style={styles.secondaryBtn} onClick={() => { setEditingItemId(undefined); setItemForm({ ...emptyItem(), categoryId: categories[0]?.id ?? 0 }); }}>Cancelar</button>}
              </div>
            </div>
          </div>

          <div style={styles.list}>
            {items.map((item) => (
              <div key={item.id} style={styles.row}>
                {item.imageUrl ? <img src={item.imageUrl} alt="" style={styles.thumb} /> : <div style={styles.thumbFallback}>Menu</div>}
                <div style={styles.rowMain}>
                  <strong>{item.name}</strong>
                  <span style={styles.muted}>{item.category.name} · ${item.price.toLocaleString('es-AR')} · {item.available ? 'Disponible' : 'Oculto'}</span>
                </div>
                <button style={styles.secondaryBtn} onClick={() => editItem(item)}>Editar</button>
                <button
                  style={item.available ? styles.dangerBtn : styles.secondaryBtn}
                  onClick={() => run(async () => {
                    await adminService.setCantinaItemAvailable(item.id, !item.available);
                    await refreshAfterSave('Disponibilidad actualizada.');
                  })}
                >
                  {item.available ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'advanced' && (
        <section>
          <div style={styles.form}>
            <h2 style={styles.sectionTitle}>Editor avanzado</h2>
            <p style={styles.helpText}>
              Selecciona cualquier modulo ya implementado, edita el JSON del registro y guarda. Para relaciones, conserva objetos con su id.
            </p>
            <label style={styles.label}>
              Recurso
              <select
                style={styles.input}
                value={selectedResource}
                onChange={(event) => setSelectedResource(event.target.value)}
              >
                {resources.map((resource) => (
                  <option key={resource.key} value={resource.key}>{resource.label}</option>
                ))}
              </select>
            </label>
            <div style={styles.resourceMeta}>
              {resources.find((resource) => resource.key === selectedResource)?.description}
            </div>
            <div style={styles.actions}>
              <button style={styles.secondaryBtn} onClick={() => loadResourceRows()}>Actualizar lista</button>
              <button
                style={styles.primaryBtn}
                onClick={() => {
                  setSelectedResourceId(null);
                  setResourceJson('{}');
                }}
              >
                Nuevo JSON
              </button>
            </div>
          </div>

          <div style={styles.advancedGrid}>
            <div style={styles.form}>
              <h3 style={styles.compactTitle}>Registros {resourceRows.length > 0 ? `(${resourceRows.length})` : ''}</h3>
              {resourceLoading ? (
                <p style={styles.muted}>Cargando...</p>
              ) : (
                <div style={styles.resourceList}>
                  {resourceRows.map((row, index) => {
                    const id = typeof row.id === 'number' ? row.id : index;
                    const title = getRowTitle(row, index);
                    return (
                      <button
                        key={`${selectedResource}-${id}`}
                        style={{
                          ...styles.resourceRow,
                          ...(selectedResourceId === row.id ? styles.resourceRowActive : {}),
                        }}
                        onClick={() => selectResourceRow(row)}
                      >
                        <strong>{title}</strong>
                        <span style={styles.muted}>ID: {String(row.id ?? 'nuevo')}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={styles.form}>
              <h3 style={styles.compactTitle}>{selectedResourceId === null ? 'Crear registro' : `Editar ID ${selectedResourceId}`}</h3>
              <textarea
                style={styles.jsonEditor}
                value={resourceJson}
                spellCheck={false}
                onChange={(event) => setResourceJson(event.target.value)}
              />
              <div style={styles.actions}>
                <button style={styles.primaryBtn} onClick={() => run(saveResourceJson)}>
                  {selectedResourceId === null ? 'Crear' : 'Guardar'}
                </button>
                {selectedResourceId !== null && (
                  <button
                    style={styles.dangerBtn}
                    onClick={() => run(async () => {
                      await adminService.deleteResourceRow(selectedResource, selectedResourceId);
                      await loadResourceRows();
                      await refreshAfterSave('Registro eliminado.');
                    })}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function getRowTitle(row: Record<string, unknown>, index: number) {
  const fields = ['title', 'name', 'description', 'email', 'orderNumber', 'code', 'opponent', 'label'];
  for (const field of fields) {
    const value = row[field];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return `Registro ${index + 1}`;
}

function Summary({ label, value }: { label: string; value?: number }) {
  return (
    <div style={styles.summaryCard}>
      <span style={styles.summaryValue}>{value ?? 0}</span>
      <span style={styles.muted}>{label}</span>
    </div>
  );
}

function TextInput({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label style={styles.label}>
      {label}
      <input type={type} style={styles.input} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function NumberInput({ label, value, onChange, step = '1' }: { label: string; value: number; onChange: (value: number) => void; step?: string }) {
  return (
    <label style={styles.label}>
      {label}
      <input type="number" step={step} style={styles.input} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '20px', color: theme.colors.text },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  title: { margin: 0, fontSize: theme.fontSizes.xxl, fontWeight: 800 },
  subtitle: { margin: '4px 0 0', color: theme.colors.textMuted, fontSize: theme.fontSizes.sm },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' },
  summaryCard: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, padding: '14px' },
  summaryValue: { display: 'block', color: theme.colors.primary, fontSize: theme.fontSizes.xxl, fontWeight: 800 },
  tabs: { display: 'flex', gap: '8px', borderBottom: `1px solid ${theme.colors.border}`, marginBottom: '16px', overflowX: 'auto' },
  tab: { border: 'none', borderBottom: '3px solid transparent', background: 'transparent', padding: '10px 12px', cursor: 'pointer', color: theme.colors.textMuted, fontWeight: 700 },
  activeTab: { color: theme.colors.primary, borderBottomColor: theme.colors.primary },
  form: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, padding: '16px', marginBottom: '16px' },
  sectionTitle: { margin: '0 0 12px', fontSize: theme.fontSizes.lg },
  compactTitle: { margin: '0 0 10px', fontSize: theme.fontSizes.md },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' },
  split: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' },
  advancedGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'start' },
  label: { display: 'flex', flexDirection: 'column', gap: '6px', color: theme.colors.textMuted, fontSize: theme.fontSizes.xs, fontWeight: 700, marginBottom: '10px' },
  input: { border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.sm, padding: '9px 10px', fontSize: theme.fontSizes.sm, color: theme.colors.text, backgroundColor: theme.colors.background },
  textarea: { border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.sm, padding: '9px 10px', minHeight: '76px', fontSize: theme.fontSizes.sm, color: theme.colors.text, backgroundColor: theme.colors.background },
  jsonEditor: { border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.sm, padding: '10px', minHeight: '420px', width: '100%', boxSizing: 'border-box', fontFamily: 'Consolas, Monaco, monospace', fontSize: theme.fontSizes.xs, color: theme.colors.text, backgroundColor: theme.colors.background },
  helpText: { margin: '0 0 12px', color: theme.colors.textMuted, fontSize: theme.fontSizes.sm, lineHeight: 1.45 },
  resourceMeta: { color: theme.colors.textMuted, fontSize: theme.fontSizes.xs, margin: '-4px 0 12px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.text, fontSize: theme.fontSizes.sm, margin: '8px 0 12px' },
  actions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  primaryBtn: { border: 'none', borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.primary, color: theme.colors.white, padding: '9px 12px', cursor: 'pointer', fontWeight: 800 },
  secondaryBtn: { border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.surface, color: theme.colors.primary, padding: '8px 11px', cursor: 'pointer', fontWeight: 700 },
  dangerBtn: { border: `1px solid ${theme.colors.error}`, borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.surface, color: theme.colors.error, padding: '8px 11px', cursor: 'pointer', fontWeight: 700 },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  row: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, padding: '10px' },
  rowMain: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' },
  muted: { color: theme.colors.textMuted, fontSize: theme.fontSizes.xs },
  thumb: { width: '48px', height: '48px', borderRadius: theme.borderRadius.sm, objectFit: 'cover', backgroundColor: theme.colors.border, flexShrink: 0 },
  thumbFallback: { width: '48px', height: '48px', borderRadius: theme.borderRadius.sm, backgroundColor: theme.colors.primary, color: theme.colors.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: theme.fontSizes.xs, flexShrink: 0 },
  compactList: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' },
  compactRow: { textAlign: 'left', border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.sm, padding: '8px 10px', backgroundColor: theme.colors.background, cursor: 'pointer', color: theme.colors.text },
  resourceList: { display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '560px', overflowY: 'auto' },
  resourceRow: { textAlign: 'left', border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.sm, padding: '9px 10px', backgroundColor: theme.colors.background, color: theme.colors.text, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '3px' },
  resourceRowActive: { borderColor: theme.colors.primary, backgroundColor: 'rgba(14, 64, 140, 0.08)' },
  success: { color: '#047857', backgroundColor: '#d1fae5', borderRadius: theme.borderRadius.md, padding: '10px 12px', fontSize: theme.fontSizes.sm },
  error: { color: theme.colors.error, backgroundColor: '#fee2e2', borderRadius: theme.borderRadius.md, padding: '10px 12px', fontSize: theme.fontSizes.sm },
};
