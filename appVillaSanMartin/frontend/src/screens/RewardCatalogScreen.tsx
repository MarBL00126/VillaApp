import React, { useEffect, useState } from 'react';
import { theme } from '../theme';
import { fanService } from '../services/fanService';

export function RewardCatalogScreen() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fanService.getRewards().then(setRewards).catch(() => setRewards([]));
  }, []);

  const redeem = async (id: number) => {
    try {
      const redemption = await fanService.redeemReward(id);
      setMessage(`Canje generado: ${redemption.code}`);
    } catch (e: any) {
      setMessage(e.response?.data?.message || 'No se pudo canjear la recompensa.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Catalogo de recompensas</h2>
      {message && <p style={styles.message}>{message}</p>}
      <div style={styles.grid}>
        {rewards.map(r => (
          <div key={r.id} style={styles.card}>
            <h3 style={styles.cardTitle}>{r.name}</h3>
            <p style={styles.desc}>{r.description}</p>
            <strong>{r.pointsCost} puntos</strong>
            <button style={styles.button} onClick={() => redeem(r.id)}>Canjear</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, minHeight: '100vh', backgroundColor: theme.colors.background },
  title: { color: theme.colors.primary },
  message: { color: theme.colors.primary, fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 },
  card: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: 8, padding: 16, boxShadow: theme.shadows.card },
  cardTitle: { marginTop: 0, color: theme.colors.primary },
  desc: { color: theme.colors.textMuted, minHeight: 42 },
  button: { display: 'block', marginTop: 12, backgroundColor: theme.colors.primary, color: theme.colors.white, border: 'none', borderRadius: 8, padding: '10px 12px', fontWeight: 700, cursor: 'pointer' },
};
