import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { theme } from '../theme';
import { fanService } from '../services/fanService';

export function TriviaScreen() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (id) fanService.getTriviaDetail(Number(id)).then(setDetail).catch(console.error);
  }, [id]);

  const submit = async () => {
    if (!id) return;
    const attempt = await fanService.submitTrivia(Number(id), Object.values(answers));
    setResult(attempt);
  };

  if (!detail) return <div style={styles.container}>Cargando trivia...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{detail.trivia.title}</h2>
      <p style={styles.muted}>{detail.trivia.description}</p>
      {detail.questions.map((q: any) => (
        <div key={q.id} style={styles.question}>
          <h3 style={styles.questionTitle}>{q.question}</h3>
          {q.options.map((o: any) => (
            <label key={o.id} style={styles.option}>
              <input type="radio" checked={answers[q.id] === o.id} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: o.id }))} />
              {o.text}
            </label>
          ))}
        </div>
      ))}
      <button style={styles.button} onClick={submit}>Enviar respuestas</button>
      {result && <p style={styles.ok}>Resultado: {result.score} correctas. Ganaste {result.pointsAwarded} puntos.</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 20, minHeight: '100vh', backgroundColor: theme.colors.background },
  title: { color: theme.colors.primary, marginBottom: 4 },
  muted: { color: theme.colors.textMuted },
  question: { backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: 8, padding: 16, marginBottom: 12 },
  questionTitle: { marginTop: 0, color: theme.colors.text },
  option: { display: 'block', padding: '8px 0', color: theme.colors.text },
  button: { backgroundColor: theme.colors.primary, color: theme.colors.white, border: 'none', borderRadius: 8, padding: '12px 16px', fontWeight: 700, cursor: 'pointer' },
  ok: { color: theme.colors.success, fontWeight: 700 },
};
