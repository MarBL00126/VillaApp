import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { pressService } from '../services/stadiumService';
import { theme } from '../theme';

export function PressRequestScreen() {
  const [matches, setMatches] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    journalistName: '',
    mediaName: '',
    role: '',
    email: '',
    phone: '',
    coverageType: 'Nota escrita',
    matchId: ''
  });
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message?: string }>({ type: 'idle' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get('/matches').then(r => {
      const upcoming = (r.data || []).filter((m: any) => new Date(m.date) >= new Date());
      setMatches(upcoming);
    }).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (!formData.journalistName || !formData.mediaName || !formData.email) {
      setStatus({ type: 'error', message: 'Por favor completá los campos obligatorios.' });
      return;
    }

    try {
      await pressService.request({
        ...formData,
        matchId: formData.matchId ? parseInt(formData.matchId) : undefined
      });
      setStatus({ type: 'success', message: '✅ Solicitud enviada correctamente. Revisamos en 24-48hs.' });
      setFormData({ journalistName: '', mediaName: '', role: '', email: '', phone: '', coverageType: 'Nota escrita', matchId: '' });
      setSubmitted(false);
    } catch (err) {
      setStatus({ type: 'error', message: 'Hubo un error al enviar la solicitud. Intentá nuevamente.' });
    }
  };

  const isInvalid = (field: string) => submitted && !(formData as any)[field];

  const styles: Record<string, React.CSSProperties> = {
    container: { padding: 20, maxWidth: 600, margin: '0 auto', fontFamily: 'sans-serif' },
    header: { background: `linear-gradient(135deg, ${theme.colors.primary}, #1a365d)`, color: '#fff', padding: 30, borderRadius: '8px 8px 0 0', textAlign: 'center' },
    formCard: { background: theme.colors.surface, padding: 30, borderRadius: '0 0 8px 8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    banner: { background: '#e0f2fe', color: '#0369a1', padding: 15, borderRadius: 8, marginBottom: 20, fontSize: '0.9rem' },
    formGroup: { marginBottom: 15 },
    label: { display: 'block', marginBottom: 5, fontWeight: 'bold', color: theme.colors.text },
    input: { width: '100%', padding: 12, borderRadius: 4, border: `1px solid ${theme.colors.border}`, boxSizing: 'border-box', fontFamily: 'inherit' },
    inputError: { borderColor: theme.colors.error, background: '#fef2f2' },
    button: { width: '100%', padding: 15, background: theme.colors.secondary, color: '#fff', border: 'none', borderRadius: 8, fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', marginTop: 10 },
    alertSuccess: { background: theme.colors.success, color: '#fff', padding: 15, borderRadius: 8, marginBottom: 20 },
    alertError: { background: theme.colors.error, color: '#fff', padding: 15, borderRadius: 8, marginBottom: 20 }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ margin: 0 }}>Solicitar Acreditación de Prensa</h1>
      </div>
      <div style={styles.formCard}>
        {status.type === 'success' && <div style={styles.alertSuccess}>{status.message}</div>}
        {status.type === 'error' && <div style={styles.alertError}>{status.message}</div>}
        
        <div style={styles.banner}>
          ℹ️ Las solicitudes se revisan en 24-48 horas hábiles. Recibirás tu credencial digital si es aprobada.
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre del Periodista *</label>
            <input name="journalistName" value={formData.journalistName} onChange={handleChange} style={{...styles.input, ...(isInvalid('journalistName') ? styles.inputError : {})}} placeholder="Juan Pérez" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre del Medio *</label>
            <input name="mediaName" value={formData.mediaName} onChange={handleChange} style={{...styles.input, ...(isInvalid('mediaName') ? styles.inputError : {})}} placeholder="Deportes Hoy" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Cargo</label>
            <input name="role" value={formData.role} onChange={handleChange} style={styles.input} placeholder="Cronista, Fotógrafo, Editor..." />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} style={{...styles.input, ...(isInvalid('email') ? styles.inputError : {})}} placeholder="juan@ejemplo.com" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Teléfono</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} placeholder="+54 9 11 1234-5678" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de Cobertura</label>
            <select name="coverageType" value={formData.coverageType} onChange={handleChange} style={styles.input}>
              <option value="Nota escrita">Nota escrita</option>
              <option value="Fotografía">Fotografía</option>
              <option value="Video">Video</option>
              <option value="Streaming">Streaming</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Partido Solicitado (Opcional)</label>
            <select name="matchId" value={formData.matchId} onChange={handleChange} style={styles.input}>
              <option value="">Seleccionar partido (o dejar en blanco para temporada)</option>
              {matches.map(m => (
                <option key={m.id} value={m.id}>{m.title || `Partido ${m.id} - ${new Date(m.date).toLocaleDateString('es-AR')}`}</option>
              ))}
            </select>
          </div>

          <button type="submit" style={styles.button}>Enviar Solicitud</button>
        </form>
      </div>
    </div>
  );
}
