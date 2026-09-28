import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { theme } from '../theme';
import type { CSSProperties } from 'react';
import type { GameLeaders, LiveMatchState, PlayByPlay } from '../types';

export function GameCenterScreen() {
  const { matchId } = useParams();
  const [state, setState] = useState<LiveMatchState | null>(null);
  const [plays, setPlays] = useState<PlayByPlay[]>([]);
  const [leaders, setLeaders] = useState<GameLeaders | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!matchId) return;
    let alive = true;

    async function load() {
      try {
        const [stateRes, playsRes, leadersRes] = await Promise.all([
          api.get<LiveMatchState>(`/game-center/${matchId}`),
          api.get<PlayByPlay[]>(`/game-center/${matchId}/plays`),
          api.get<GameLeaders>(`/game-center/${matchId}/leaders`),
        ]);
        if (!alive) return;
        setState(stateRes.data);
        setPlays(playsRes.data || []);
        setLeaders(leadersRes.data);
        setError('');
      } catch {
        if (alive) setError('No se pudo cargar el Game Center.');
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    const timer = window.setInterval(load, 15000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, [matchId]);

  if (loading) return <LoadingSpinner />;
  if (!matchId) return <EmptyState message="Partido no encontrado" />;

  const latestPlays = [...plays].reverse().slice(0, 5);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Game Center</p>
          <h1 style={styles.title}>Partido #{matchId}</h1>
        </div>
        <span style={styles.status}>{state?.status || 'PRE'}</span>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <section style={styles.scoreboard}>
        <div style={styles.teamScore}>
          <span style={styles.scoreLabel}>Villa San Martín</span>
          <strong style={styles.score}>{state?.homeScore ?? 0}</strong>
        </div>
        <div style={styles.clockBox}>
          <span>{state?.quarter ? `Q${state.quarter}` : 'Q1'}</span>
          <strong>{state?.clock || '10:00'}</strong>
        </div>
        <div style={styles.teamScore}>
          <span style={styles.scoreLabel}>Rival</span>
          <strong style={styles.score}>{state?.awayScore ?? 0}</strong>
        </div>
      </section>

      <nav style={styles.tabs}>
        <Link to={`/game-center/${matchId}/plays`} style={styles.tab}>Play-by-play</Link>
        <Link to={`/game-center/${matchId}/box-score`} style={styles.tab}>Box score</Link>
        <Link to={`/game-center/${matchId}/shot-chart`} style={styles.tab}>Shot chart</Link>
      </nav>

      <section style={styles.grid}>
        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Últimas jugadas</h2>
          {latestPlays.length === 0 ? (
            <EmptyState message="Sin jugadas cargadas" />
          ) : (
            latestPlays.map((play) => (
              <div key={play.id} style={styles.playRow}>
                <span style={styles.playClock}>{play.clock}</span>
                <span>{play.description}</span>
              </div>
            ))
          )}
        </article>

        <article style={styles.card}>
          <h2 style={styles.cardTitle}>Líderes</h2>
          <Leader label="Puntos" item={leaders?.topScorer} valueKey="points" />
          <Leader label="Rebotes" item={leaders?.topRebounder} valueKey="rebounds" />
          <Leader label="Asistencias" item={leaders?.topAssistant} valueKey="assists" />
          <Leader label="Robos" item={leaders?.topStealer} valueKey="steals" />
          <Leader label="Tapones" item={leaders?.topBlocker} valueKey="blocks" />
        </article>
      </section>
    </div>
  );
}

function Leader({ label, item, valueKey }: { label: string; item: any; valueKey: string }) {
  return (
    <div style={styles.leaderRow}>
      <span>{label}</span>
      <strong>{item ? `${item.playerName} (${item[valueKey]})` : '-'}</strong>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' },
  kicker: { margin: 0, color: theme.colors.secondary, fontWeight: 700 },
  title: { margin: 0, color: theme.colors.text, fontSize: theme.fontSizes.title },
  status: { padding: '0.35rem 0.75rem', borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.primary, color: theme.colors.white, fontWeight: 700 },
  scoreboard: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'center', backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, padding: '1rem', boxShadow: theme.shadows.card },
  teamScore: { textAlign: 'center' },
  scoreLabel: { display: 'block', color: theme.colors.textMuted, fontSize: theme.fontSizes.sm },
  score: { display: 'block', color: theme.colors.primary, fontSize: '3rem', lineHeight: 1 },
  clockBox: { minWidth: '92px', textAlign: 'center', color: theme.colors.text, fontWeight: 700 },
  tabs: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  tab: { padding: '0.55rem 0.85rem', borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}`, color: theme.colors.primary, textDecoration: 'none', fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' },
  card: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, padding: '1rem', boxShadow: theme.shadows.card },
  cardTitle: { margin: '0 0 0.75rem', color: theme.colors.text, fontSize: theme.fontSizes.xl },
  playRow: { display: 'flex', gap: '0.75rem', padding: '0.55rem 0', borderBottom: `1px solid ${theme.colors.border}` },
  playClock: { color: theme.colors.textMuted, minWidth: '48px', fontWeight: 700 },
  leaderRow: { display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.45rem 0', borderBottom: `1px solid ${theme.colors.border}` },
  error: { color: theme.colors.error },
};
