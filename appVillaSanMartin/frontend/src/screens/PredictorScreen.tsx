import React, { useEffect, useState } from 'react';
import { theme } from '../theme';
import api from '../services/api';
import { fanService } from '../services/fanService';

export function PredictorScreen() {
  const [matches, setMatches] = useState<any[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [home, setHome] = useState(80);
  const [away, setAway] = useState(74);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/matches').then(r => {
      setMatches(r.data);
      setSelected(r.data?.[0]?.id ?? null);
    }).catch(() => setMatches([]));
  }, []);

  const submit = async () => {
    if (!selected) return;
    const prediction = await fanService.predict({ matchId: selected, predictedHomeScore: home, predictedAwayScore: away });
    setMessage(`Prediccion guardada. Puntos: ${prediction.pointsAwarded ?? 0}`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Predictor</h2>
      <select style={styles.input} value={selected ?? ''} onChange={e => setSelected(Number(e.target.value))}>
        {matches.map(m => <option key={m.id} value={m.id}>{m.team?.name ?? 'VSM'} vs {m.opponent}</option>)}
      </select>
      <div style={styles.row}>
        <label style={styles.label}>Villa <input style={styles.score} type="number" value={home} onChange={e => setHome(Number(e.target.value))} /></label>
        <label style={styles.label}>Rival <input style={styles.score} type="number" value={away} onChange={e => setAway(Number(e.target.value))} /></label>
      </div>
      <button style={styles.button} onClick={submit} disabled={!selected}>Enviar prediccion</button>
      {message && <p style={styles.ok}>{message}</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, minHeight: '100vh', backgroundColor: theme.colors.background },
  title: { color: theme.colors.primary },
  input: { width: '100%', padding: 12, borderRadius: 8, border: `1px solid ${theme.colors.border}`, marginBottom: 16 },
  row: { display: 'flex', gap: 12, marginBottom: 16 },
  label: { flex: 1, fontWeight: 700, color: theme.colors.text },
  score: { width: '100%', boxSizing: 'border-box', marginTop: 6, padding: 12, borderRadius: 8, border: `1px solid ${theme.colors.border}` },
  button: { backgroundColor: theme.colors.secondary, color: theme.colors.primary, border: 'none', borderRadius: 8, padding: '12px 16px', fontWeight: 700, cursor: 'pointer' },
  ok: { color: theme.colors.success, fontWeight: 700 },
};
