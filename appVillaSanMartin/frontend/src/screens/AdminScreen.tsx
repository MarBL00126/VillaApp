import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../theme';
import type { AdminDashboardFull, AppConfig, CantinaMenuCategory, CantinaMenuItem, CantinaOrder, Match, Membership, Player } from '../types';
import { adminService, type AdminResourceInfo, type CategoryPayload, type MatchPayload, type MenuItemPayload, type PlayerPayload } from '../services/adminService';

type Tab = 'dashboard' | 'players' | 'matches' | 'news' | 'shop' | 'orders' | 'members' | 'cantina' | 'config' | 'stadium' | 'advanced';

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

const IMAGE_FIELD_BY_RESOURCE: Record<string, string> = {
  staff: 'photoUrl',
  teams: 'logoUrl',
  products: 'imageUrl',
  news: 'imageUrl',
  photos: 'imageUrl',
  galleries: 'coverImageUrl',
  badges: 'imageUrl',
  benefits: 'imageUrl',
  rewards: 'imageUrl',
  videos: 'thumbnail',
};

const IMAGE_FIELD_CANDIDATES = ['imageUrl', 'photoUrl', 'coverImageUrl', 'thumbnail', 'logoUrl'];

const RESOURCE_DRAFTS: Record<string, Record<string, unknown>> = {
  staff: { name: '', role: '', photoUrl: '', bio: '', active: true },
  products: { name: '', description: '', price: 0, imageUrl: '', active: true },
  news: { title: '', summary: '', content: '', imageUrl: '', featured: false, author: '' },
  photos: { imageUrl: '', caption: '', sortOrder: 0 },
  galleries: { title: '', coverImageUrl: '', eventDate: '' },
  videos: { title: '', description: '', url: '', thumbnail: '', type: '', publishedAt: '' },
  benefits: { title: '', description: '', imageUrl: '', active: true },
  rewards: { name: '', description: '', imageUrl: '', pointsCost: 0, stock: 0, active: true },
  badges: { name: '', description: '', imageUrl: '', pointsRequired: 0 },
  teams: { name: '', city: '', shortName: '', logoUrl: '', stadium: '', category: '', primaryTeam: false, active: true },
};

export function AdminScreen() {
  const [tab, setTab] = useState<Tab>('players');
  const [dashboard, setDashboard] = useState<Record<string, number>>({});
  const [dashboardFull, setDashboardFull] = useState<Partial<AdminDashboardFull>>({});
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [categories, setCategories] = useState<CantinaMenuCategory[]>([]);
  const [items, setItems] = useState<CantinaMenuItem[]>([]);
  const [canteenOrders, setCanteenOrders] = useState<CantinaOrder[]>([]);
  const [members, setMembers] = useState<Membership[]>([]);
  const [configs, setConfigs] = useState<AppConfig[]>([]);
  const [variantRows, setVariantRows] = useState<Record<string, unknown>[]>([]);
  const [configDrafts, setConfigDrafts] = useState<Record<string, string>>({});
  const [stockDrafts, setStockDrafts] = useState<Record<number, number>>({});
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
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  const loadData = async () => {
    setError('');
    const [summary, fullSummary, playerRows, matchRows, categoryRows, itemRows, orderRows, memberRows, configRows, resourceRows, variants] = await Promise.all([
      adminService.getDashboard(),
      adminService.getDashboardFull().catch(() => ({})),
      adminService.getPlayers(),
      adminService.getMatches(),
      adminService.getCantinaCategories(),
      adminService.getCantinaItems(),
      adminService.getCanteenOrders().catch(() => []),
      adminService.getMembers().catch(() => []),
      adminService.getConfig().catch(() => []),
      adminService.getResources(),
      adminService.getResourceRows('product-variants').catch(() => []),
    ]);
    setDashboard(summary);
    setDashboardFull(fullSummary);
    setPlayers(playerRows);
    setMatches([...matchRows].sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()));
    setCategories(categoryRows);
    setItems(itemRows);
    setCanteenOrders(orderRows);
    setMembers(memberRows);
    setConfigs(configRows);
    setConfigDrafts(Object.fromEntries(configRows.map((config) => [config.key, config.value])));
    setVariantRows(variants);
    setStockDrafts(Object.fromEntries(variants.map((row) => [Number(row.id), Number(row.stock ?? 0)])));
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
      setResourceJson(emptyResourceDraft(resource));
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
      setError('No se pudieron leer los datos del formulario.');
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

  const openAdvancedResource = async (resource: string) => {
    setSelectedResource(resource);
    setTab('advanced');
    await loadResourceRows(resource);
  };

  const updateOrderStatus = async (id: number, status: string) => {
    await adminService.setCanteenOrderStatus(id, status);
    await refreshAfterSave('Estado del pedido actualizado.');
  };

  const updateMemberStatus = async (id: number, status: string) => {
    await adminService.setMemberStatus(id, status);
    await refreshAfterSave('Estado del socio actualizado.');
  };

  const updateConfig = async (config: AppConfig) => {
    await adminService.setConfigValue(config.key, configDrafts[config.key] ?? config.value);
    await refreshAfterSave('Configuracion actualizada.');
  };

  const updateVariantStock = async (row: Record<string, unknown>) => {
    const variantId = Number(row.id);
    const product = row.product as { id?: number } | undefined;
    const productId = Number(product?.id);
    const stock = stockDrafts[variantId] ?? Number(row.stock ?? 0);
    if (Number.isFinite(productId) && productId > 0) {
      await adminService.setProductVariantStock(productId, variantId, stock);
    } else {
      await adminService.updateResourceRow('product-variants', variantId, { ...row, stock });
    }
    await refreshAfterSave('Stock actualizado.');
  };

  const uploadAndUseImage = async (target: string, file: File, onUploaded: (url: string) => void) => {
    setError('');
    setUploadingTarget(target);
    try {
      const uploaded = await adminService.uploadImage(file, target);
      onUploaded(uploaded.url);
      setMessage('Imagen adjuntada. Guarda el registro para aplicar el cambio.');
      setTimeout(() => setMessage(''), 2500);
    } catch (uploadError) {
      setError(readUploadError(uploadError));
    } finally {
      setUploadingTarget(null);
    }
  };

  const applyImageToResourceJson = (url: string) => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(resourceJson) as Record<string, unknown>;
    } catch {
      parsed = {};
    }
    const field = IMAGE_FIELD_BY_RESOURCE[selectedResource]
      ?? IMAGE_FIELD_CANDIDATES.find((candidate) => candidate in parsed)
      ?? 'imageUrl';
    setResourceJson(JSON.stringify({ ...parsed, [field]: url }, null, 2));
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
        <Summary label="Jugadores" value={dashboardFull.players ?? dashboard.players} />
        <Summary label="Partidos" value={dashboardFull.matches ?? dashboard.matches} />
        <Summary label="Socios activos" value={dashboardFull.activeMembers} />
        <Summary label="Pedidos hoy" value={dashboardFull.canteenOrdersToday} />
      </div>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(tab === 'dashboard' ? styles.activeTab : {}) }} onClick={() => setTab('dashboard')}>Dashboard</button>
        <button style={{ ...styles.tab, ...(tab === 'players' ? styles.activeTab : {}) }} onClick={() => setTab('players')}>Plantel</button>
        <button style={{ ...styles.tab, ...(tab === 'matches' ? styles.activeTab : {}) }} onClick={() => setTab('matches')}>Partidos</button>
        <button style={{ ...styles.tab, ...(tab === 'news' ? styles.activeTab : {}) }} onClick={() => setTab('news')}>Noticias</button>
        <button style={{ ...styles.tab, ...(tab === 'shop' ? styles.activeTab : {}) }} onClick={() => setTab('shop')}>Tienda</button>
        <button style={{ ...styles.tab, ...(tab === 'orders' ? styles.activeTab : {}) }} onClick={() => setTab('orders')}>Pedidos</button>
        <button style={{ ...styles.tab, ...(tab === 'members' ? styles.activeTab : {}) }} onClick={() => setTab('members')}>Socios</button>
        <button style={{ ...styles.tab, ...(tab === 'cantina' ? styles.activeTab : {}) }} onClick={() => setTab('cantina')}>Cantina</button>
        <button style={{ ...styles.tab, ...(tab === 'config' ? styles.activeTab : {}) }} onClick={() => setTab('config')}>Config</button>
        <button style={{ ...styles.tab, ...(tab === 'stadium' ? styles.activeTab : {}) }} onClick={() => setTab('stadium')}>Estadio</button>
        <button style={{ ...styles.tab, ...(tab === 'advanced' ? styles.activeTab : {}) }} onClick={() => setTab('advanced')}>Modulos</button>
      </div>

      {tab === 'dashboard' && (
        <section>
          <div style={styles.summaryGrid}>
            <Summary label="Productos" value={dashboardFull.products} />
            <Summary label="Cuotas pendientes" value={dashboardFull.pendingFees} />
            <Summary label="Items cantina" value={dashboardFull.menuItems ?? dashboard.menuItems} />
            <Summary label="Categorias" value={dashboardFull.menuCategories ?? dashboard.menuCategories} />
          </div>
          <div style={styles.form}>
            <h2 style={styles.sectionTitle}>Acciones rapidas</h2>
            <div style={styles.actions}>
              <button style={styles.primaryBtn} onClick={() => openAdvancedResource('news')}>Gestionar noticias</button>
              <button style={styles.primaryBtn} onClick={() => setTab('shop')}>Actualizar stock</button>
              <button style={styles.primaryBtn} onClick={() => setTab('orders')}>Ver pedidos</button>
              <button style={styles.primaryBtn} onClick={() => setTab('members')}>Buscar socios</button>
              <button style={styles.primaryBtn} onClick={() => setTab('config')}>Editar config</button>
              <Link style={styles.primaryLink} to="/admin/access/scan">Escanear accesos</Link>
              <Link style={styles.primaryLink} to="/admin/press">Prensa admin</Link>
              <Link style={styles.secondaryLink} to="/admin/stadium">Estadio admin</Link>
              <Link style={styles.secondaryLink} to="/admin/config">Config pantalla completa</Link>
            </div>
          </div>
        </section>
      )}

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
              <ImageInput
                label="Foto"
                value={playerForm.imageUrl ?? ''}
                uploading={uploadingTarget === 'players'}
                onChange={(imageUrl) => setPlayerForm({ ...playerForm, imageUrl })}
                onFile={(file) => uploadAndUseImage('players', file, (imageUrl) => setPlayerForm((current) => ({ ...current, imageUrl })))}
              />
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
                <Link style={styles.secondaryLink} to={`/game-center/${match.id}`}>Game Center</Link>
                <Link style={styles.secondaryLink} to={`/admin/game-center/${match.id}`}>Cargar vivo</Link>
                <Link style={styles.secondaryLink} to={`/admin/access/logs/${match.id}`}>Logs acceso</Link>
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
              <ImageInput
                label="Foto"
                value={itemForm.imageUrl ?? ''}
                uploading={uploadingTarget === 'cantina'}
                onChange={(imageUrl) => setItemForm({ ...itemForm, imageUrl })}
                onFile={(file) => uploadAndUseImage('cantina', file, (imageUrl) => setItemForm((current) => ({ ...current, imageUrl })))}
              />
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

      {tab === 'news' && (
        <section>
          <div style={styles.form}>
            <h2 style={styles.sectionTitle}>Noticias</h2>
            <p style={styles.helpText}>Usa el editor de modulos para altas, edicion y eliminacion de noticias y categorias.</p>
            <div style={styles.actions}>
              <button style={styles.primaryBtn} onClick={() => openAdvancedResource('news')}>Abrir noticias</button>
              <button style={styles.secondaryBtn} onClick={() => openAdvancedResource('news-categories')}>Abrir categorias</button>
            </div>
          </div>
        </section>
      )}

      {tab === 'shop' && (
        <section>
          <div style={styles.form}>
            <h2 style={styles.sectionTitle}>Tienda y stock</h2>
            <div style={styles.actions}>
              <button style={styles.secondaryBtn} onClick={() => openAdvancedResource('products')}>Editar productos</button>
              <button style={styles.secondaryBtn} onClick={() => openAdvancedResource('product-categories')}>Editar categorias</button>
              <button style={styles.secondaryBtn} onClick={() => openAdvancedResource('product-variants')}>Editor de variantes</button>
            </div>
          </div>
          <div style={styles.list}>
            {variantRows.map((row) => {
              const id = Number(row.id);
              const product = row.product as { name?: string } | undefined;
              return (
                <div key={id} style={styles.row}>
                  <div style={styles.rowMain}>
                    <strong>{product?.name ?? 'Producto'} · {String(row.label ?? 'Variante')}</strong>
                    <span style={styles.muted}>Stock actual: {String(row.stock ?? 0)}</span>
                  </div>
                  <input
                    type="number"
                    style={{ ...styles.input, width: 110 }}
                    value={stockDrafts[id] ?? 0}
                    onChange={(event) => setStockDrafts({ ...stockDrafts, [id]: Number(event.target.value) })}
                  />
                  <button style={styles.primaryBtn} onClick={() => run(() => updateVariantStock(row))}>Guardar stock</button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {tab === 'orders' && (
        <section>
          <div style={styles.list}>
            {canteenOrders.map((order) => (
              <div key={order.id} style={styles.row}>
                <div style={styles.rowMain}>
                  <strong>{order.orderNumber}</strong>
                  <span style={styles.muted}>${order.totalAmount?.toLocaleString('es-AR') ?? 0} · {order.status}</span>
                </div>
                {['PENDING', 'PREPARING', 'READY', 'DELIVERED'].map((status) => (
                  <button key={status} style={order.status === status ? styles.primaryBtn : styles.secondaryBtn} onClick={() => run(() => updateOrderStatus(order.id, status))}>{status}</button>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'members' && (
        <section>
          <div style={styles.list}>
            {members.map((member) => (
              <div key={member.id} style={styles.row}>
                <div style={styles.rowMain}>
                  <strong>{member.fullName || `${member.user?.name ?? ''} ${member.user?.surname ?? ''}`.trim() || member.memberNumber}</strong>
                  <span style={styles.muted}>Nro {member.memberNumber} · {member.status}</span>
                </div>
                <button style={member.status === 'ACTIVE' ? styles.primaryBtn : styles.secondaryBtn} onClick={() => run(() => updateMemberStatus(member.id, 'ACTIVE'))}>Activar</button>
                <button style={member.status === 'SUSPENDED' ? styles.dangerBtn : styles.secondaryBtn} onClick={() => run(() => updateMemberStatus(member.id, 'SUSPENDED'))}>Suspender</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'config' && (
        <section>
          <div style={styles.list}>
            {configs.map((config) => (
              <div key={config.id} style={styles.row}>
                <div style={styles.rowMain}>
                  <strong>{config.key}</strong>
                  <span style={styles.muted}>{config.type} · {config.description}</span>
                </div>
                <input
                  style={styles.input}
                  value={configDrafts[config.key] ?? ''}
                  onChange={(event) => setConfigDrafts({ ...configDrafts, [config.key]: event.target.value })}
                />
                <button style={styles.primaryBtn} onClick={() => run(() => updateConfig(config))}>Guardar</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'stadium' && (
        <section>
          <div style={styles.form}>
            <h2 style={styles.sectionTitle}>Estadio</h2>
            <p style={styles.helpText}>Edita informacion general, sectores y servicios desde el editor de modulos.</p>
            <div style={styles.actions}>
              <button style={styles.primaryBtn} onClick={() => openAdvancedResource('stadium-info')}>Info general</button>
              <button style={styles.secondaryBtn} onClick={() => openAdvancedResource('stadium-sectors')}>Sectores</button>
              <button style={styles.secondaryBtn} onClick={() => openAdvancedResource('stadium-services')}>Servicios</button>
            </div>
          </div>
        </section>
      )}

      {tab === 'advanced' && (
        <section>
          <div style={styles.form}>
            <h2 style={styles.sectionTitle}>Gestion de modulos</h2>
            <p style={styles.helpText}>
              Selecciona un modulo, elegi un registro y actualiza sus datos.
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
                  setResourceJson(emptyResourceDraft(selectedResource));
                }}
              >
                Nuevo registro
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
              <ImageInput
                label="Foto del registro"
                value={readImageValue(resourceJson, selectedResource)}
                uploading={uploadingTarget === selectedResource}
                onChange={applyImageToResourceJson}
                onFile={(file) => uploadAndUseImage(selectedResource || 'general', file, applyImageToResourceJson)}
              />
              <ResourceFields
                value={resourceJson}
                resource={selectedResource}
                onChange={setResourceJson}
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

function emptyResourceDraft(resource: string) {
  return JSON.stringify(RESOURCE_DRAFTS[resource] ?? {}, null, 2);
}

function parseResourceValue(value: string) {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function readImageValue(json: string, resource: string) {
  try {
    const parsed = JSON.parse(json) as Record<string, unknown>;
    const field = IMAGE_FIELD_BY_RESOURCE[resource] ?? IMAGE_FIELD_CANDIDATES.find((candidate) => candidate in parsed);
    const value = field ? parsed[field] : undefined;
    return typeof value === 'string' ? value : '';
  } catch {
    return '';
  }
}

function readUploadError(error: unknown) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: unknown } }).response;
    const data = response?.data;
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim()) return message;
    }
    if (typeof data === 'string' && data.trim()) return data;
  }
  return 'No se pudo subir la imagen. Usa JPG, PNG, WEBP o GIF de hasta 20MB.';
}

function updateResourceValue(json: string, field: string, value: unknown) {
  const parsed = parseResourceValue(json);
  return JSON.stringify({ ...parsed, [field]: value }, null, 2);
}

function updateRelationValue(json: string, field: string, id: number) {
  const parsed = parseResourceValue(json);
  const current = parsed[field];
  const relation = current && typeof current === 'object' && !Array.isArray(current) ? current as Record<string, unknown> : {};
  return JSON.stringify({ ...parsed, [field]: { ...relation, id } }, null, 2);
}

function formatFieldLabel(field: string) {
  const labels: Record<string, string> = {
    active: 'Activo',
    author: 'Autor',
    bio: 'Biografia',
    caption: 'Epigrafe',
    category: 'Categoria',
    city: 'Ciudad',
    content: 'Contenido',
    description: 'Descripcion',
    eventDate: 'Fecha',
    featured: 'Destacada',
    name: 'Nombre',
    pointsCost: 'Costo en puntos',
    pointsRequired: 'Puntos requeridos',
    price: 'Precio',
    primaryTeam: 'Equipo principal',
    publishedAt: 'Publicado',
    role: 'Rol',
    shortName: 'Nombre corto',
    sortOrder: 'Orden',
    stadium: 'Estadio',
    stock: 'Stock',
    summary: 'Resumen',
    team: 'Equipo',
    title: 'Titulo',
    type: 'Tipo',
    url: 'Enlace',
  };
  return labels[field] ?? field.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

function Summary({ label, value }: { label: string; value?: number }) {
  return (
    <div style={styles.summaryCard}>
      <span style={styles.summaryValue}>{value ?? 0}</span>
      <span style={styles.muted}>{label}</span>
    </div>
  );
}

function ResourceFields({ value, resource, onChange }: { value: string; resource: string; onChange: (value: string) => void }) {
  const data = parseResourceValue(value);
  const imageField = IMAGE_FIELD_BY_RESOURCE[resource] ?? IMAGE_FIELD_CANDIDATES.find((candidate) => candidate in data);
  const entries = Object.entries(data).filter(([field, fieldValue]) => {
    if (field === 'id' || field === imageField || IMAGE_FIELD_CANDIDATES.includes(field)) return false;
    if (Array.isArray(fieldValue)) return false;
    return ['string', 'number', 'boolean', 'object'].includes(typeof fieldValue) || fieldValue === null;
  });

  if (entries.length === 0) {
    return <p style={styles.muted}>Selecciona un registro o crea uno nuevo para completar sus datos.</p>;
  }

  return (
    <div style={styles.generatedFields}>
      {entries.map(([field, fieldValue]) => {
        const label = formatFieldLabel(field);
        if (typeof fieldValue === 'boolean') {
          return (
            <label key={field} style={styles.checkboxLabel}>
              <input type="checkbox" checked={fieldValue} onChange={(event) => onChange(updateResourceValue(value, field, event.target.checked))} />
              {label}
            </label>
          );
        }
        if (fieldValue && typeof fieldValue === 'object') {
          const relation = fieldValue as Record<string, unknown>;
          const id = typeof relation.id === 'number' ? relation.id : 0;
          return (
            <NumberInput
              key={field}
              label={`${label} relacionado`}
              value={id}
              onChange={(nextId) => onChange(updateRelationValue(value, field, nextId))}
            />
          );
        }
        if (typeof fieldValue === 'number') {
          return (
            <NumberInput
              key={field}
              label={label}
              value={fieldValue}
              step={field.toLowerCase().includes('price') ? '0.01' : '1'}
              onChange={(nextValue) => onChange(updateResourceValue(value, field, nextValue))}
            />
          );
        }
        const text = fieldValue === null ? '' : String(fieldValue);
        if (['bio', 'content', 'description', 'summary'].includes(field)) {
          return (
            <label key={field} style={styles.label}>
              {label}
              <textarea style={styles.textarea} value={text} onChange={(event) => onChange(updateResourceValue(value, field, event.target.value))} />
            </label>
          );
        }
        return (
          <TextInput
            key={field}
            label={label}
            value={text}
            onChange={(nextValue) => onChange(updateResourceValue(value, field, nextValue))}
          />
        );
      })}
    </div>
  );
}

function ImageInput({
  label,
  value,
  uploading,
  onChange,
  onFile,
}: {
  label: string;
  value: string;
  uploading: boolean;
  onChange: (value: string) => void;
  onFile: (file: File) => void;
}) {
  return (
    <div style={styles.label}>
      <span>{label}</span>
      <div style={styles.imageControlRow}>
        {value ? <img src={value} alt="" style={styles.imagePreview} /> : <span style={styles.muted}>Sin foto adjunta</span>}
        <label style={{ ...styles.secondaryBtn, ...(uploading ? styles.disabledBtn : {}) }}>
          {uploading ? 'Subiendo...' : 'Adjuntar foto'}
          <input
            type="file"
            accept="image/*"
            style={styles.fileInput}
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) onFile(file);
            }}
          />
        </label>
        {value && (
          <button type="button" style={styles.secondaryBtn} onClick={() => onChange('')}>
            Quitar foto
          </button>
        )}
      </div>
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
  generatedFields: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '12px' },
  label: { display: 'flex', flexDirection: 'column', gap: '6px', color: theme.colors.textMuted, fontSize: theme.fontSizes.xs, fontWeight: 700, marginBottom: '10px' },
  input: { border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.sm, padding: '9px 10px', fontSize: theme.fontSizes.sm, color: theme.colors.text, backgroundColor: theme.colors.background },
  imageControlRow: { display: 'flex', alignItems: 'center', gap: '8px', minHeight: '44px' },
  imagePreview: { width: '44px', height: '44px', borderRadius: theme.borderRadius.sm, objectFit: 'cover', border: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.background },
  fileInput: { display: 'none' },
  textarea: { border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.sm, padding: '9px 10px', minHeight: '76px', fontSize: theme.fontSizes.sm, color: theme.colors.text, backgroundColor: theme.colors.background },
  jsonEditor: { border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.sm, padding: '10px', minHeight: '420px', width: '100%', boxSizing: 'border-box', fontFamily: 'Consolas, Monaco, monospace', fontSize: theme.fontSizes.xs, color: theme.colors.text, backgroundColor: theme.colors.background },
  helpText: { margin: '0 0 12px', color: theme.colors.textMuted, fontSize: theme.fontSizes.sm, lineHeight: 1.45 },
  resourceMeta: { color: theme.colors.textMuted, fontSize: theme.fontSizes.xs, margin: '-4px 0 12px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.text, fontSize: theme.fontSizes.sm, margin: '8px 0 12px' },
  actions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  primaryBtn: { border: 'none', borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.primary, color: theme.colors.white, padding: '9px 12px', cursor: 'pointer', fontWeight: 800 },
  secondaryBtn: { border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.surface, color: theme.colors.primary, padding: '8px 11px', cursor: 'pointer', fontWeight: 700 },
  disabledBtn: { opacity: 0.6, cursor: 'wait' },
  primaryLink: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '44px', border: 'none', borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.primary, color: theme.colors.white, padding: '9px 12px', cursor: 'pointer', fontWeight: 800, textDecoration: 'none' },
  secondaryLink: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '44px', border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.surface, color: theme.colors.primary, padding: '8px 11px', cursor: 'pointer', fontWeight: 700, textDecoration: 'none' },
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
