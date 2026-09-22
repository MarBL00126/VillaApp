import React, { useEffect, useState } from 'react';
import { theme } from '../theme';
import { membershipService } from '../services/membershipService';
import api from '../services/api';

export function PreferencesScreen() {
  const [prefs, setPrefs] = useState<any>({
    notifyNews: true, notifyVideos: true, notifyFees: true, notifyBenefits: true, notifyMatchResults: true
  });
  const [players, setPlayers] = useState<any[]>([]);
  const [favoritePlayer, setFavoritePlayer] = useState<any>(null);
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [playerSearch, setPlayerSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      membershipService.getPreferences().catch(() => ({})),
      api.get('/players').then(r => r.data).catch(() => [])
    ]).then(([p, pl]) => {
      setPrefs((prev: any) => ({ ...prev, ...p }));
      setPlayers(pl);
      if (p.favoritePlayerId) {
        const fav = pl.find((x: any) => x.id === p.favoritePlayerId);
        setFavoritePlayer(fav);
      }
      setLoading(false);
    });
  }, []);

  const handleToggle = async (key: string) => {
    const newVal = !prefs[key];
    const newPrefs = { ...prefs, [key]: newVal };
    setPrefs(newPrefs);
    try {
      await membershipService.updatePreferences(newPrefs);
    } catch (e) {
      console.error(e);
      setPrefs(prefs); // revert on error
    }
  };

  const handleSelectPlayer = async (playerId: number) => {
    try {
      await membershipService.setFavoritePlayer(playerId);
      const fav = players.find(x => x.id === playerId);
      setFavoritePlayer(fav);
      setShowPlayerSelector(false);
    } catch (e) {
      console.error(e);
      alert('Error al guardar jugador favorito');
    }
  };

  const filteredPlayers = players.filter(p => 
    `${p.name} ${p.surname}`.toLowerCase().includes(playerSearch.toLowerCase())
  );

  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: '20px',
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    },
    title: {
      color: theme.colors.primary,
      margin: '0 0 20px 0',
      borderBottom: `2px solid ${theme.colors.secondary}`,
      paddingBottom: '10px',
    },
    section: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: '20px',
      boxShadow: theme.shadows.card,
      marginBottom: '20px',
    },
    sectionTitle: {
      margin: '0 0 15px 0',
      fontSize: theme.fontSizes.lg,
      color: theme.colors.primary,
    },
    playerInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
      padding: '15px',
      borderRadius: theme.borderRadius.md,
    },
    playerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    avatar: {
      width: '50px', height: '50px',
      borderRadius: '50%',
      backgroundColor: theme.colors.primary,
      color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '20px',
    },
    changeBtn: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.primary,
      border: 'none',
      padding: '8px 16px',
      borderRadius: theme.borderRadius.md,
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    selectorWrap: {
      marginTop: '15px',
    },
    searchInput: {
      width: '100%',
      padding: '10px',
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.border}`,
      marginBottom: '10px',
      boxSizing: 'border-box',
    },
    playerList: {
      maxHeight: '200px',
      overflowY: 'auto',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.md,
    },
    playerItem: {
      padding: '10px 15px',
      borderBottom: `1px solid ${theme.colors.border}`,
      cursor: 'pointer',
    },
    toggleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 0',
      borderBottom: `1px solid ${theme.colors.border}`,
    }
  };

  const getInitials = (p: any) => {
    if (!p) return '?';
    return `${p.name?.[0]||''}${p.surname?.[0]||''}`.toUpperCase();
  };

  if (loading) return <div style={styles.container}>Cargando...</div>;

  const toggles = [
    { key: 'notifyNews', label: '📰 Noticias' },
    { key: 'notifyVideos', label: '🎥 Videos' },
    { key: 'notifyFees', label: '💳 Cuotas' },
    { key: 'notifyBenefits', label: '🎁 Beneficios' },
    { key: 'notifyMatchResults', label: '🏀 Resultados de partidos' },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Preferencias</h2>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>👤 Jugador Favorito</h3>
        <div style={styles.playerInfo}>
          <div style={styles.playerLeft}>
            <div style={styles.avatar}>{getInitials(favoritePlayer)}</div>
            <div>
              <h4 style={{ margin: 0 }}>{favoritePlayer ? `${favoritePlayer.name} ${favoritePlayer.surname}` : 'Ninguno'}</h4>
              <p style={{ margin: 0, color: theme.colors.textMuted, fontSize: theme.fontSizes.sm }}>
                {favoritePlayer?.position || 'Seleccioná tu jugador'}
              </p>
            </div>
          </div>
          <button style={styles.changeBtn} onClick={() => setShowPlayerSelector(!showPlayerSelector)}>
            Cambiar
          </button>
        </div>

        {showPlayerSelector && (
          <div style={styles.selectorWrap}>
            <input 
              style={styles.searchInput}
              placeholder="Buscar jugador..."
              value={playerSearch}
              onChange={e => setPlayerSearch(e.target.value)}
            />
            <div style={styles.playerList}>
              {filteredPlayers.map(p => (
                <div key={p.id} style={styles.playerItem} onClick={() => handleSelectPlayer(p.id)}>
                  <strong>{p.name} {p.surname}</strong> <span style={{color: '#666', fontSize:'12px'}}>({p.position})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🔔 Notificaciones</h3>
        {toggles.map((t, idx) => (
          <div key={t.key} style={{...styles.toggleRow, borderBottom: idx === toggles.length - 1 ? 'none' : styles.toggleRow.borderBottom}}>
            <span>{t.label}</span>
            <div
              onClick={() => handleToggle(t.key)}
              style={{
                width: 44, height: 24, borderRadius: 12,
                backgroundColor: prefs[t.key] ? '#f5a623' : '#d1d5db',
                cursor: 'pointer', position: 'relative', transition: 'background 0.2s'
              }}
            >
              <div style={{
                position: 'absolute', top: 2,
                left: prefs[t.key] ? 22 : 2,
                width: 20, height: 20, borderRadius: '50%',
                backgroundColor: 'white', transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
