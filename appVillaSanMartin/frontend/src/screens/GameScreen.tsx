import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../theme';
import { fanService } from '../services/fanService';

export function GameScreen() {
  const [points, setPoints] = useState<any>(null);
  const [trivias, setTrivias] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fanService.getPoints().catch(() => null),
      fanService.getTrivia().catch(() => []),
      fanService.getPolls().catch(() => []),
    ]).then(([p, t, po]) => {
      setPoints(p);
      setTrivias(t);
      setPolls(po);
    });
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Fan Engagement</h1>
      <div style={styles.scoreBand}>
        <div>
          <span style={styles.kicker}>Mis puntos</span>
          <strong style={styles.points}>{points?.totalPoints ?? 0}</strong>
        </div>
        <span style={styles.level}>{points?.level ?? 'ROOKIE'}</span>
      </div>

      <div style={styles.grid}>
        <Link style={styles.card} to="/game/predictor">Predictor de partidos</Link>
        {trivias[0] && <Link style={styles.card} to={`/game/trivia/${trivias[0].id}`}>Trivia activa</Link>}
        {polls[0] && <Link style={styles.card} to={`/game/polls/${polls[0].id}`}>Encuestas y MVP</Link>}
        <Link style={styles.card} to="/rewards">Mis recompensas</Link>
        <Link style={styles.card} to="/rewards/leaderboard">Leaderboard</Link>
        <Link style={styles.card} to="/community">Fan Wall</Link>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, minHeight: '100vh', backgroundColor: theme.colors.background },
  title: { margin: '0 0 16px', color: theme.colors.primary },
  scoreBand: { backgroundColor: theme.colors.primary, color: theme.colors.white, borderRadius: 8, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  kicker: { display: 'block', color: theme.colors.secondary, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' },
  points: { display: 'block', fontSize: 36, lineHeight: 1 },
  level: { backgroundColor: theme.colors.secondary, color: theme.colors.primary, borderRadius: 999, padding: '6px 12px', fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
  card: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: 8, padding: 18, color: theme.colors.primary, textDecoration: 'none', fontWeight: 700, boxShadow: theme.shadows.card },
};
