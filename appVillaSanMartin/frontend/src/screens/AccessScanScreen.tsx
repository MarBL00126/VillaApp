import React, { useState, useEffect, useRef } from 'react';
import { accessService } from '../services/stadiumService';
import api from '../services/api';
import { theme } from '../theme';

export function AccessScanScreen() {
  const [matches, setMatches] = useState<any[]>([]);
  const [matchId, setMatchId] = useState<string>('');
  const [gate, setGate] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get('/matches').then(r => {
      // Assuming a simplistic filter for "today/upcoming" based on date. Adjust as needed.
      const upcoming = (r.data || []).filter((m: any) => new Date(m.date) >= new Date(new Date().setHours(0,0,0,0)));
      setMatches(upcoming);
      if (upcoming.length > 0) setMatchId(upcoming[0].id.toString());
    }).catch(console.error);
  }, []);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!qrCode || !gate) return;
    
    try {
      const res = await accessService.scan(qrCode, gate, matchId ? parseInt(matchId) : undefined);
      setResult(res);
      setRecentScans(prev => [{ ...res, qrCode, scannedAt: new Date().toISOString() }, ...prev].slice(0, 10));
    } catch (err: any) {
      const fallbackResult = err.response?.data || { ok: false, status: 'ERROR', message: 'Error de red' };
      setResult(fallbackResult);
      setRecentScans(prev => [{ ...fallbackResult, qrCode, scannedAt: new Date().toISOString() }, ...prev].slice(0, 10));
    }

    setQrCode('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getResultStyle = () => {
    if (!result) return {};
    if (result.ok) return { background: theme.colors.success, color: '#fff' };
    if (result.status === 'DUPLICATE') return { background: '#f59e0b', color: '#fff' };
    return { background: theme.colors.error, color: '#fff' };
  };

  const getResultMessage = () => {
    if (!result) return '';
    if (result.ok) return 'Acceso Permitido';
    if (result.status === 'DUPLICATE') return 'QR ya utilizado';
    if (result.status === 'INVALID') return 'QR inválido';
    if (result.status === 'EXPIRED') return 'QR vencido';
    if (result.status === 'WRONG_MATCH') return 'Partido incorrecto';
    return result.message || 'Acceso Denegado';
  };

  const styles: Record<string, React.CSSProperties> = {
    container: { padding: 20, maxWidth: 800, margin: '0 auto', fontFamily: 'sans-serif' },
    header: { background: theme.colors.primary, color: '#fff', padding: 20, borderRadius: 8, textAlign: 'center', marginBottom: 20 },
    formGroup: { marginBottom: 15 },
    label: { display: 'block', marginBottom: 5, fontWeight: 'bold' },
    input: { width: '100%', padding: 12, borderRadius: 4, border: `1px solid ${theme.colors.border}`, boxSizing: 'border-box', fontSize: '1rem' },
    qrInput: { width: '100%', padding: 20, borderRadius: 8, border: `2px dashed ${theme.colors.primary}`, boxSizing: 'border-box', fontSize: '1.2rem', textAlign: 'center' },
    button: { width: '100%', padding: 15, background: theme.colors.primary, color: '#fff', border: 'none', borderRadius: 8, fontSize: '1.1rem', cursor: 'pointer', marginTop: 10 },
    resultCard: { padding: 30, borderRadius: 8, textAlign: 'center', marginTop: 20, transition: 'all 0.3s', ...getResultStyle() },
    recentList: { listStyle: 'none', padding: 0, marginTop: 20 },
    recentItem: { padding: 10, borderBottom: `1px solid ${theme.colors.border}`, display: 'flex', justifyContent: 'space-between' },
    statsBar: { background: theme.colors.surface, padding: 15, borderRadius: 8, marginTop: 20, display: 'flex', justifyContent: 'space-between', border: `1px solid ${theme.colors.border}` }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ margin: 0 }}>Control de Acceso</h1>
      </div>

      <div style={styles.statsBar}>
        <strong>Escaneos recientes en esta sesión:</strong>
        <span>{recentScans.length}</span>
      </div>

      <div style={{ background: theme.colors.surface, padding: 20, borderRadius: 8, marginTop: 20, border: `1px solid ${theme.colors.border}` }}>
        <div style={{ display: 'flex', gap: 15, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Partido</label>
            <select style={styles.input} value={matchId} onChange={e => setMatchId(e.target.value)}>
              <option value="">Seleccionar partido (Opcional)</option>
              {matches.map(m => (
                <option key={m.id} value={m.id}>{m.title || `Partido ${m.id}`}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Puerta</label>
            <input style={styles.input} type="text" placeholder="Ej: Puerta A" value={gate} onChange={e => setGate(e.target.value)} />
          </div>
        </div>

        <form onSubmit={handleScan}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Escanear QR</label>
            <input 
              ref={inputRef}
              autoFocus
              style={styles.qrInput} 
              type="text" 
              placeholder="Escanear QR..." 
              value={qrCode} 
              onChange={e => setQrCode(e.target.value)} 
            />
          </div>
          <button type="submit" style={styles.button}>Escanear</button>
        </form>
      </div>

      {result && (
        <div style={styles.resultCard}>
          <h2 style={{ margin: '0 0 10px', fontSize: '2rem' }}>
            {result.ok ? '✅ ' : '❌ '} {getResultMessage()}
          </h2>
          {result.ok && (
            <div style={{ fontSize: '1.2rem' }}>
              <strong>{result.name}</strong> <br/>
              {result.type} - {result.sectorName} - {result.gate}
            </div>
          )}
        </div>
      )}

      {recentScans.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Últimos escaneos</h3>
          <ul style={styles.recentList}>
            {recentScans.map((scan, idx) => (
              <li key={idx} style={styles.recentItem}>
                <div>
                  <strong style={{ color: scan.ok ? theme.colors.success : theme.colors.error }}>
                    {scan.ok ? '✅ OK' : `❌ ${scan.status || 'ERROR'}`}
                  </strong> - {scan.name || 'Desconocido'}
                </div>
                <div style={{ color: theme.colors.textMuted }}>
                  {new Date(scan.scannedAt).toLocaleTimeString('es-AR')}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
