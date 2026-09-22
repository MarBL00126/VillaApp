import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { theme } from '../theme';
import { fanService } from '../services/fanService';

export function MvpVoteScreen() {
  const { matchId } = useParams<{ matchId: string }>();
  const [polls, setPolls] = useState<any[]>([]);

  useEffect(() => {
    if (matchId) fanService.getMvpPolls(Number(matchId)).then(setPolls).catch(() => setPolls([]));
  }, [matchId]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Votar MVP</h2>
      {polls.length === 0 ? (
        <p style={styles.empty}>No hay votacion MVP para este partido.</p>
      ) : polls.map(p => <Link key={p.id} style={styles.card} to={`/game/polls/${p.id}`}>{p.title}</Link>)}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, minHeight: '100vh', backgroundColor: theme.colors.background },
  title: { color: theme.colors.primary },
  card: { display: 'block', backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: 8, padding: 16, color: theme.colors.primary, textDecoration: 'none', fontWeight: 700 },
  empty: { color: theme.colors.textMuted },
};
