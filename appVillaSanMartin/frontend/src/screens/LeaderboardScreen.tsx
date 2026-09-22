import React, { useEffect, useState } from 'react';
import { theme } from '../theme';
import { fanService } from '../services/fanService';

export function LeaderboardScreen() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    fanService.getLeaderboard().then(setRows).catch(() => setRows([]));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Ranking de fans</h2>
      {rows.map((row, index) => (
        <div key={row.id} style={styles.row}>
          <span style={styles.rank}>{index + 1}</span>
          <span style={styles.name}>{row.user?.name} {row.user?.surname}</span>
          <strong>{row.totalPoints} pts</strong>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, minHeight: '100vh', backgroundColor: theme.colors.background },
  title: { color: theme.colors.primary },
  row: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: 8, padding: 14, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 },
  rank: { width: 30, height: 30, borderRadius: '50%', backgroundColor: theme.colors.secondary, color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  name: { flex: 1, fontWeight: 700, color: theme.colors.text },
};
