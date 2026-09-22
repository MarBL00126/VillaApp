import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../theme';
import { fanService } from '../services/fanService';

export function RewardsScreen() {
  const [points, setPoints] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fanService.getPoints(),
      fanService.getBadges().catch(() => []),
      fanService.getTransactions().catch(() => []),
    ]).then(([p, b, t]) => {
      setPoints(p);
      setBadges(b);
      setTxs(t);
    });
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mis puntos</h2>
      <div style={styles.summary}>
        <strong style={styles.points}>{points?.totalPoints ?? 0}</strong>
        <span style={styles.level}>{points?.level ?? 'ROOKIE'}</span>
      </div>
      <div style={styles.actions}>
        <Link style={styles.button} to="/rewards/catalog">Catalogo</Link>
        <Link style={styles.button} to="/rewards/leaderboard">Ranking</Link>
      </div>
      <h3 style={styles.section}>Badges</h3>
      <div style={styles.grid}>
        {badges.length === 0 ? <span style={styles.empty}>Todavia no desbloqueaste badges.</span> : badges.map(b => (
          <div key={b.id} style={styles.badge}>{b.badge?.name ?? b.name}</div>
        ))}
      </div>
      <h3 style={styles.section}>Movimientos</h3>
      {txs.slice(0, 8).map(tx => (
        <div key={tx.id} style={styles.tx}>
          <span>{tx.reason}</span>
          <strong>{tx.amount > 0 ? '+' : ''}{tx.amount}</strong>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, minHeight: '100vh', backgroundColor: theme.colors.background },
  title: { color: theme.colors.primary },
  summary: { backgroundColor: theme.colors.primary, color: theme.colors.white, borderRadius: 8, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  points: { fontSize: 42 },
  level: { backgroundColor: theme.colors.secondary, color: theme.colors.primary, borderRadius: 999, padding: '6px 12px', fontWeight: 700 },
  actions: { display: 'flex', gap: 10, margin: '16px 0' },
  button: { backgroundColor: theme.colors.secondary, color: theme.colors.primary, borderRadius: 8, padding: '10px 14px', textDecoration: 'none', fontWeight: 700 },
  section: { color: theme.colors.text, marginTop: 24 },
  grid: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  badge: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: 999, padding: '8px 12px', fontWeight: 700 },
  empty: { color: theme.colors.textMuted },
  tx: { backgroundColor: theme.colors.surface, borderBottom: `1px solid ${theme.colors.border}`, padding: 12, display: 'flex', justifyContent: 'space-between' },
};
