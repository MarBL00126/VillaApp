import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { theme } from '../theme';
import type { Player, PlayerStats } from '../types';
import api from '../services/api';
import { membershipService } from '../services/membershipService';

interface StatRow {
  label: string;
  value: number | undefined;
}

export function PlayerDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: player, loading: l1, error: e1, refetch } = useFetch<Player>(`/players/${id}`);
  const { data: stats, loading: l2 } = useFetch<PlayerStats>(`/stats/player/${id}`);

  useEffect(() => {
    if (!id) return;
    if (!localStorage.getItem('token')) return;
    membershipService.getPreferences()
      .then((prefs) => setIsFavorite((prefs.favoritePlayerId ?? prefs.favoritePlayer?.id) === Number(id)))
      .catch(() => setIsFavorite(false));
  }, [id]);

  const handleFavorite = async () => {
    if (!id) return;
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    if (isFavorite) {
      await api.delete(`/players/${id}/favorite`);
      setIsFavorite(false);
    } else {
      await api.post(`/players/${id}/favorite`);
      setIsFavorite(true);
    }
    refetch();
  };

  if (l1 || l2) return <LoadingSpinner />;
  if (e1 || !player) return <EmptyState message="Jugador no encontrado." />;

  const statRows: StatRow[] = stats
    ? [
        { label: 'Partidos jugados', value: stats.playedGames },
        { label: 'Minutos totales', value: stats.totalMinutes },
        { label: 'Puntos', value: stats.totalPoints },
        { label: 'Rebotes', value: stats.totalRebounds },
        { label: 'Asistencias', value: stats.totalAssists },
        { label: 'Tapones', value: stats.totalBlocks },
        { label: 'Robos', value: stats.totalSteals },
        { label: 'Pérdidas', value: stats.totalTurnovers },
        { label: 'Faltas', value: stats.totalFouls },
        { label: 'Valoración', value: stats.totalValoration },
        { label: 'Libres convertidos', value: stats.madeFreeThrows },
        { label: 'Libres intentados', value: stats.attemptedFreeThrows },
        { label: 'Dobles convertidos', value: stats.madeTwoPointers },
        { label: 'Dobles intentados', value: stats.attemptedTwoPointers },
        { label: 'Triples convertidos', value: stats.madeThreePointers },
        { label: 'Triples intentados', value: stats.attemptedThreePointers },
      ]
    : [];

  return (
    <div>
      <button onClick={() => navigate('/players')} style={styles.back}>← Volver</button>

      {/* Header jugador */}
      <div style={styles.hero}>
        {player.imageUrl ? (
          <img src={player.imageUrl} alt={`${player.name} ${player.surname}`} style={styles.avatarImg} />
        ) : (
          <div style={styles.avatar}>
            <span style={styles.number}>#{player.shirtNumber}</span>
          </div>
        )}
        <div>
          <h1 style={styles.name}>{player.name} {player.surname}</h1>
          <p style={styles.position}>{player.position}</p>
          <p style={styles.meta}>
            {player.height}m · {player.nationality} · {player.team.name}
          </p>
          <p style={styles.meta}>
            Nacido: {new Date(player.birthDate).toLocaleDateString('es-AR')}
          </p>
          {player.biography && <p style={styles.bio}>{player.biography}</p>}
          <button type="button" onClick={handleFavorite} style={{ ...styles.favoriteBtn, ...(isFavorite ? styles.favoriteActive : {}) }}>
            {isFavorite ? '★ Jugador favorito' : '☆ Marcar favorito'}
          </button>
          <p style={styles.meta}>{player.favoriteCount ?? 0} hinchas lo marcaron favorito</p>
        </div>
      </div>

      {/* Estadísticas */}
      <h2 style={styles.statsTitle}>Estadísticas de temporada</h2>
      {stats ? (
        <div style={styles.statsGrid}>
          {statRows.map((row) => (
            <div key={row.label} style={styles.statCard}>
              <span style={styles.statLabel}>{row.label}</span>
              <span style={styles.statValue}>{row.value ?? '—'}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="Sin estadísticas registradas" />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  back: {
    background: 'none',
    border: 'none',
    color: theme.colors.primary,
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: theme.fontSizes.sm,
    marginBottom: '1rem',
    padding: 0,
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: '1.5rem',
    boxShadow: theme.shadows.card,
    marginBottom: '1.5rem',
    border: `1px solid ${theme.colors.border}`,
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: theme.colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  number: { color: theme.colors.secondary, fontWeight: 700, fontSize: '1.5rem' },
  name: { margin: 0, fontSize: theme.fontSizes.xxl, fontWeight: 700, color: theme.colors.text },
  position: { color: theme.colors.primary, fontWeight: 600, margin: '0.25rem 0', fontSize: theme.fontSizes.md },
  meta: { color: theme.colors.textMuted, fontSize: theme.fontSizes.sm, margin: '0.1rem 0' },
  bio: { color: theme.colors.text, fontSize: theme.fontSizes.sm, margin: '0.75rem 0', maxWidth: 520, lineHeight: 1.5 },
  favoriteBtn: {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.full,
    padding: '0.45rem 0.9rem',
    backgroundColor: theme.colors.surface,
    color: theme.colors.primary,
    cursor: 'pointer',
    fontWeight: 700,
    margin: '0.75rem 0 0.35rem',
  },
  avatarImg: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
    backgroundColor: theme.colors.border,
  },
  favoriteActive: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  statsTitle: { fontSize: theme.fontSizes.lg, fontWeight: 700, color: theme.colors.text, marginBottom: '1rem' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '0.75rem',
  },
  statCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: '0.875rem',
    boxShadow: theme.shadows.card,
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  statLabel: { fontSize: theme.fontSizes.xs, color: theme.colors.textMuted, fontWeight: 600 },
  statValue: { fontSize: theme.fontSizes.xl, fontWeight: 700, color: theme.colors.primary },
};
