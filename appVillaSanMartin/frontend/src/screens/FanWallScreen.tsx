import React, { useEffect, useState } from 'react';
import { theme } from '../theme';
import { fanService } from '../services/fanService';

export function FanWallScreen() {
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState('');

  const load = () => fanService.getFanWall().then(setComments).catch(() => setComments([]));
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!content.trim()) return;
    await fanService.addComment('COMMUNITY', 1, content);
    setContent('');
    load();
  };

  const like = async (id: number) => {
    await fanService.react('COMMENT', id, 'LIKE');
    load();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Fan Wall</h2>
      <div style={styles.composer}>
        <textarea style={styles.textarea} value={content} onChange={e => setContent(e.target.value)} placeholder="Compartí un mensaje para la comunidad..." />
        <button style={styles.button} onClick={submit}>Publicar</button>
      </div>
      {comments.map(c => (
        <div key={c.id} style={styles.comment}>
          <strong>{c.authorName}</strong>
          <p style={styles.body}>{c.content}</p>
          <button style={styles.react} onClick={() => like(c.id)}>LIKE</button>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, minHeight: '100vh', backgroundColor: theme.colors.background },
  title: { color: theme.colors.primary },
  composer: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: 8, padding: 12, marginBottom: 16 },
  textarea: { width: '100%', minHeight: 80, boxSizing: 'border-box', borderRadius: 8, border: `1px solid ${theme.colors.border}`, padding: 10, resize: 'vertical' },
  button: { marginTop: 8, backgroundColor: theme.colors.primary, color: theme.colors.white, border: 'none', borderRadius: 8, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' },
  comment: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: 8, padding: 14, marginBottom: 10 },
  body: { color: theme.colors.text, margin: '8px 0' },
  react: { background: 'none', border: `1px solid ${theme.colors.border}`, borderRadius: 999, padding: '5px 10px', cursor: 'pointer', color: theme.colors.primary, fontWeight: 700 },
};
