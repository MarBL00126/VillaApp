import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { theme } from '../theme';
import { fanService } from '../services/fanService';

export function MatchChatScreen() {
  const { id } = useParams<{ id: string }>();
  const matchId = Number(id);
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState('');

  const load = () => fanService.getComments('MATCH', matchId).then(setComments).catch(() => setComments([]));
  useEffect(() => { if (matchId) load(); }, [matchId]);

  const submit = async () => {
    if (!content.trim()) return;
    await fanService.addComment('MATCH', matchId, content);
    setContent('');
    load();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Chat del partido</h2>
      <div style={styles.list}>
        {comments.map(c => (
          <div key={c.id} style={styles.message}>
            <strong>{c.authorName}</strong>
            <span>{c.content}</span>
          </div>
        ))}
      </div>
      <div style={styles.inputRow}>
        <input style={styles.input} value={content} onChange={e => setContent(e.target.value)} placeholder="Escribí un mensaje..." />
        <button style={styles.button} onClick={submit}>Enviar</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, minHeight: '100vh', backgroundColor: theme.colors.background },
  title: { color: theme.colors.primary },
  list: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 },
  message: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 4 },
  inputRow: { display: 'flex', gap: 8 },
  input: { flex: 1, padding: 12, borderRadius: 8, border: `1px solid ${theme.colors.border}` },
  button: { backgroundColor: theme.colors.secondary, color: theme.colors.primary, border: 'none', borderRadius: 8, padding: '0 16px', fontWeight: 700, cursor: 'pointer' },
};
