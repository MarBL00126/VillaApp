import React, { useEffect, useState } from 'react';
import { stadiumService } from '../services/stadiumService';
import { theme } from '../theme';

export function StadiumScreen() {
  const [stadium, setStadium] = useState<any>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      stadiumService.getInfo(),
      stadiumService.getSectors(),
      stadiumService.getServices()
    ]).then(([stadiumData, sectorsData, servicesData]) => {
      setStadium(stadiumData);
      setSectors(sectorsData);
      setServices(servicesData);
      setLoading(false);
    }).catch(_ => {
      setError('Error al cargar la información del estadio');
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Cargando...</div>;
  if (error) return <div style={{ padding: 20, color: theme.colors.error, textAlign: 'center' }}>{error}</div>;

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'PLATEA': return '#3b82f6'; // blue
      case 'POPULAR': return '#22c55e'; // green
      case 'VIP': return '#eab308'; // gold
      case 'PRENSA': return '#ef4444'; // red
      default: return theme.colors.primary;
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'BANO': return '🚻';
      case 'PARKING': return '🅿';
      case 'GASTRONOMIA': return '🍔';
      case 'MERCH': return '👕';
      case 'PRIMEROS_AUXILIOS': return '🏥';
      default: return '📍';
    }
  };

  const filteredServices = filterType ? services.filter(s => s.type === filterType) : services;

  const styles: Record<string, React.CSSProperties> = {
    hero: { background: `linear-gradient(to right, ${theme.colors.primary}, #1a365d)`, color: theme.colors.surface, padding: '40px 20px', textAlign: 'center' },
    title: { fontSize: '2.5rem', margin: '0 0 10px 0' },
    badge: { display: 'inline-block', padding: '5px 10px', background: 'rgba(255,255,255,0.2)', borderRadius: 20, fontSize: '0.9rem' },
    card: { background: theme.colors.surface, padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', margin: '-20px 20px 20px', position: 'relative' as any },
    buttonsRow: { display: 'flex', gap: 10, justifyContent: 'center', marginTop: 15 },
    button: { padding: '10px 20px', borderRadius: 8, border: 'none', background: theme.colors.primary, color: '#fff', cursor: 'pointer', textDecoration: 'none' },
    section: { padding: 20 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 15, marginTop: 15 },
    sectorCard: { background: theme.colors.surface, borderRadius: 8, padding: 15, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 5 },
    serviceCard: { background: theme.colors.surface, borderRadius: 8, padding: 15, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 10 },
    tabs: { display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10, marginTop: 15 },
    tab: { padding: '8px 16px', borderRadius: 20, border: `1px solid ${theme.colors.border}`, background: theme.colors.surface, cursor: 'pointer', whiteSpace: 'nowrap' },
    activeTab: { background: theme.colors.primary, color: theme.colors.surface, borderColor: theme.colors.primary }
  };

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh', paddingBottom: 40 }}>
      <div style={styles.hero}>
        <div style={{ fontSize: '3rem', marginBottom: 10 }}>🏟️</div>
        <h1 style={styles.title}>Estadio</h1>
        <div style={styles.badge}>Capacidad: {stadium?.capacity?.toLocaleString('es-AR')}</div>
      </div>

      <div style={styles.card}>
        <h2 style={{ margin: '0 0 5px' }}>{stadium?.name}</h2>
        <p style={{ margin: 0, color: theme.colors.textMuted }}>{stadium?.address}, {stadium?.city}</p>
        
        <div style={styles.buttonsRow}>
          {stadium?.mapUrl && (
            <a href={stadium.mapUrl} target="_blank" rel="noreferrer" style={styles.button}>📍 Cómo llegar</a>
          )}
          {stadium?.parkingUrl && (
            <a href={stadium.parkingUrl} target="_blank" rel="noreferrer" style={styles.button}>🅿 Parking</a>
          )}
        </div>
      </div>

      <div style={styles.section}>
        <h2>Sectores</h2>
        <div style={styles.grid}>
          {sectors.map(sector => (
            <div key={sector.id} style={{ ...styles.sectorCard, borderLeft: `6px solid ${sector.colorHex || '#ccc'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0 }}>{sector.name}</h3>
                <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: 4, color: '#fff', background: getBadgeColor(sector.type) }}>
                  {sector.type}
                </span>
              </div>
              <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: theme.colors.textMuted }}>{sector.description}</p>
              <div style={{ marginTop: 10, fontSize: '0.85rem' }}>
                <strong>Puerta:</strong> {sector.gate} <br />
                <strong>Capacidad:</strong> {sector.capacity}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2>Servicios</h2>
        <div style={styles.tabs}>
          {['', 'BANO', 'PARKING', 'GASTRONOMIA', 'MERCH', 'PRIMEROS_AUXILIOS'].map(type => (
            <button 
              key={type} 
              style={{ ...styles.tab, ...(filterType === type ? styles.activeTab : {}) }}
              onClick={() => setFilterType(type)}
            >
              {type === '' ? 'Todos' : `${getServiceIcon(type)} ${type}`}
            </button>
          ))}
        </div>
        
        <div style={styles.grid}>
          {filteredServices.map(service => (
            <div key={service.id} style={styles.serviceCard}>
              <div style={{ fontSize: '2rem' }}>{getServiceIcon(service.type)}</div>
              <div>
                <h4 style={{ margin: 0 }}>{service.name}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: theme.colors.textMuted }}>{service.location}</p>
              </div>
            </div>
          ))}
          {filteredServices.length === 0 && <p style={{ color: theme.colors.textMuted }}>No se encontraron servicios de este tipo.</p>}
        </div>
      </div>
    </div>
  );
}
