import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { theme } from '../theme';
import type { CSSProperties } from 'react';
import type { BoxScore, ShotChartShot } from '../types';

export function ShotChartScreen() {
  const { matchId } = useParams();
  const [players, setPlayers] = useState<BoxScore[]>([]);
  const [playerId, setPlayerId] = useState('');
  const [shots, setShots] = useState<ShotChartShot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!matchId) return;
    api.get<BoxScore[]>(`/game-center/${matchId}/box-score`)
      .then((res) => {
        setPlayers(res.data || []);
        if (res.data?.[0]) setPlayerId(String(res.data[0].playerId));
      })
      .catch(() => setError('No se pudieron cargar los jugadores.'))
      .finally(() => setLoading(false));
  }, [matchId]);

  useEffect(() => {
    if (!matchId || !playerId) return;
    api.get<ShotChartShot[]>(`/game-center/${matchId}/shot-chart/${playerId}`)
      .then((res) => setShots(res.data || []))
      .catch(() => setError('No se pudo cargar el shot chart.'));
  }, [matchId, playerId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Shot chart</h1>
        <select value={playerId} onChange={(event) => setPlayerId(event.target.value)} style={styles.select}>
          {players.map((player) => (
            <option key={player.playerId} value={player.playerId}>{player.playerName}</option>
          ))}
        </select>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {players.length === 0 ? (
        <EmptyState message="Primero cargá box score para elegir un jugador" />
      ) : (
        <div style={styles.court}>
          <div style={styles.hoop} />
          <div style={styles.paint} />
          <div style={styles.arc} />
          {shots.map((shot) => (
            <span
              key={shot.id}
              title={`${shot.shotType} ${shot.made ? 'convertido' : 'fallado'}`}
              style={{
                ...styles.shot,
                left: `${shot.x}%`,
                top: `${shot.y}%`,
                backgroundColor: shot.made ? theme.colors.success : theme.colors.error,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' },
  title: { margin: 0, color: theme.colors.text, fontSize: theme.fontSizes.title },
  select: { padding: '0.55rem', borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}` },
  court: { position: 'relative', width: '100%', maxWidth: '720px', aspectRatio: '1.65', margin: '0 auto', backgroundColor: '#f8fafc', border: `3px solid ${theme.colors.primary}`, borderRadius: theme.borderRadius.md, overflow: 'hidden' },
  hoop: { position: 'absolute', left: '50%', top: '8%', width: '42px', height: '12px', transform: 'translateX(-50%)', border: `3px solid ${theme.colors.secondary}`, borderRadius: theme.borderRadius.full },
  paint: { position: 'absolute', left: '35%', top: 0, width: '30%', height: '38%', border: `2px solid ${theme.colors.primary}`, borderTop: 'none' },
  arc: { position: 'absolute', left: '20%', top: '-18%', width: '60%', height: '62%', border: `2px solid ${theme.colors.primary}`, borderRadius: '50%' },
  shot: { position: 'absolute', width: '14px', height: '14px', borderRadius: '50%', transform: 'translate(-50%, -50%)', border: `2px solid ${theme.colors.white}`, boxShadow: theme.shadows.card },
  error: { color: theme.colors.error },
};
