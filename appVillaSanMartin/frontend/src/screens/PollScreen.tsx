import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { theme } from '../theme';
import { fanService } from '../services/fanService';

export function PollScreen() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<any>(null);
  const [message, setMessage] = useState('');

  const load = () => {
    if (id) fanService.getPollDetail(Number(id)).then(setDetail).catch(console.error);
  };
  useEffect(() => { load(); }, [id]);

  const vote = async (optionId: number) => {
    if (!id) return;
    await fanService.votePoll(Number(id), optionId);
    setMessage('Voto registrado. Sumaste puntos si era tu primer voto.');
    load();
  };

  if (!detail) return <div style={styles.container}>Cargando encuesta...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{detail.poll.title}</h2>
      {detail.options.map((o: any) => (
        <div key={o.id} style={styles.option}>
          <div>
            <strong>{o.text}</strong>
            <span style={styles.votes}>{o.votes} votos</span>
          </div>
          <button style={styles.button} onClick={() => vote(o.id)}>Votar</button>
        </div>
      ))}
      {message && <p style={styles.ok}>{message}</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, minHeight: '100vh', backgroundColor: theme.colors.background },
  title: { color: theme.colors.primary },
  option: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: 8, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  votes: { display: 'block', color: theme.colors.textMuted, fontSize: 12, marginTop: 4 },
  button: { backgroundColor: theme.colors.secondary, color: theme.colors.primary, border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' },
  ok: { color: theme.colors.success, fontWeight: 700 },
};
