import { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { theme } from '../theme';
import type { CSSProperties, FormEvent, ReactNode } from 'react';

export function AdminGameCenterScreen() {
  const { matchId } = useParams();
  const [message, setMessage] = useState('');
  const [stateForm, setStateForm] = useState({ status: 'LIVE', quarter: '1', clock: '10:00', homeScore: '0', awayScore: '0' });
  const [playForm, setPlayForm] = useState({ quarter: '1', clock: '10:00', eventType: 'BASKET_2', playerId: '', teamIsLocal: 'true', homeScore: '0', awayScore: '0', description: '' });
  const [boxForm, setBoxForm] = useState({ playerId: '', teamIsLocal: 'true', minutes: '0', points: '0', rebounds: '0', assists: '0', steals: '0', blocks: '0', turnovers: '0', fouls: '0', plusMinus: '0', fgMade: '0', fgAtt: '0', threeMade: '0', threeAtt: '0', ftMade: '0', ftAtt: '0', offRebounds: '0', defRebounds: '0' });
  const [shotForm, setShotForm] = useState({ playerId: '', quarter: '1', clock: '10:00', x: '50', y: '50', made: 'true', shotType: 'TWO' });

  async function submitState(event: FormEvent) {
    event.preventDefault();
    await api.put(`/game-center/${matchId}/state`, toNumbers(stateForm, ['quarter', 'homeScore', 'awayScore']));
    setMessage('Marcador actualizado.');
  }

  async function submitPlay(event: FormEvent) {
    event.preventDefault();
    await api.post(`/game-center/${matchId}/plays`, {
      ...toNumbers(playForm, ['quarter', 'playerId', 'homeScore', 'awayScore']),
      playerId: playForm.playerId ? Number(playForm.playerId) : null,
      teamIsLocal: playForm.teamIsLocal === 'true',
    });
    setMessage('Jugada agregada.');
  }

  async function submitBox(event: FormEvent) {
    event.preventDefault();
    await api.put(`/game-center/${matchId}/box-score/${boxForm.playerId}`, {
      ...toNumbers(boxForm, ['points', 'rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'fouls', 'plusMinus', 'fgMade', 'fgAtt', 'threeMade', 'threeAtt', 'ftMade', 'ftAtt', 'offRebounds', 'defRebounds']),
      minutes: Number(boxForm.minutes),
      teamIsLocal: boxForm.teamIsLocal === 'true',
    });
    setMessage('Box score actualizado.');
  }

  async function submitShot(event: FormEvent) {
    event.preventDefault();
    await api.post(`/game-center/${matchId}/shot-chart`, {
      ...toNumbers(shotForm, ['playerId', 'quarter']),
      x: Number(shotForm.x),
      y: Number(shotForm.y),
      made: shotForm.made === 'true',
    });
    setMessage('Tiro registrado.');
  }

  return (
    <div style={styles.page}>
      <div>
        <p style={styles.kicker}>Admin</p>
        <h1 style={styles.title}>Game Center #{matchId}</h1>
      </div>
      {message && <p style={styles.success}>{message}</p>}

      <Panel title="Marcador" onSubmit={submitState}>
        <Field label="Estado" value={stateForm.status} onChange={(value) => setStateForm({ ...stateForm, status: value })} />
        <Field label="Cuarto" value={stateForm.quarter} onChange={(value) => setStateForm({ ...stateForm, quarter: value })} />
        <Field label="Reloj" value={stateForm.clock} onChange={(value) => setStateForm({ ...stateForm, clock: value })} />
        <Field label="Local" value={stateForm.homeScore} onChange={(value) => setStateForm({ ...stateForm, homeScore: value })} />
        <Field label="Visitante" value={stateForm.awayScore} onChange={(value) => setStateForm({ ...stateForm, awayScore: value })} />
      </Panel>

      <Panel title="Play-by-play" onSubmit={submitPlay}>
        <Field label="Cuarto" value={playForm.quarter} onChange={(value) => setPlayForm({ ...playForm, quarter: value })} />
        <Field label="Reloj" value={playForm.clock} onChange={(value) => setPlayForm({ ...playForm, clock: value })} />
        <Field label="Evento" value={playForm.eventType} onChange={(value) => setPlayForm({ ...playForm, eventType: value })} />
        <Field label="Jugador ID" value={playForm.playerId} onChange={(value) => setPlayForm({ ...playForm, playerId: value })} />
        <Field label="Descripción" value={playForm.description} onChange={(value) => setPlayForm({ ...playForm, description: value })} />
      </Panel>

      <Panel title="Box score" onSubmit={submitBox}>
        {Object.entries(boxForm).map(([key, value]) => (
          <Field key={key} label={key} value={value} onChange={(next) => setBoxForm({ ...boxForm, [key]: next })} />
        ))}
      </Panel>

      <Panel title="Shot chart" onSubmit={submitShot}>
        {Object.entries(shotForm).map(([key, value]) => (
          <Field key={key} label={key} value={value} onChange={(next) => setShotForm({ ...shotForm, [key]: next })} />
        ))}
      </Panel>
    </div>
  );
}

function Panel({ title, onSubmit, children }: { title: string; onSubmit: (event: FormEvent) => void; children: ReactNode }) {
  return (
    <form onSubmit={onSubmit} style={styles.panel}>
      <h2 style={styles.panelTitle}>{title}</h2>
      <div style={styles.grid}>{children}</div>
      <button type="submit" style={styles.primaryButton}>Guardar</button>
    </form>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label style={styles.label}>
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} style={styles.input} />
    </label>
  );
}

function toNumbers(values: Record<string, string>, keys: string[]) {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => (
    keys.includes(key) ? [key, value === '' ? null : Number(value)] : [key, value]
  )));
}

const styles: Record<string, CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  kicker: { margin: 0, color: theme.colors.secondary, fontWeight: 700 },
  title: { margin: 0, color: theme.colors.text, fontSize: theme.fontSizes.title },
  success: { color: theme.colors.success, fontWeight: 700 },
  panel: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.md, padding: '1rem', boxShadow: theme.shadows.card },
  panelTitle: { margin: '0 0 0.75rem', color: theme.colors.text, fontSize: theme.fontSizes.xl },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.65rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.25rem', color: theme.colors.text, fontWeight: 700, fontSize: theme.fontSizes.sm },
  input: { padding: '0.55rem', borderRadius: theme.borderRadius.md, border: `1px solid ${theme.colors.border}` },
  primaryButton: { marginTop: '0.85rem', padding: '0.65rem 1rem', border: 'none', borderRadius: theme.borderRadius.md, backgroundColor: theme.colors.primary, color: theme.colors.white, fontWeight: 700, cursor: 'pointer' },
};
