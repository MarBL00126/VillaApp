import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { theme } from "../theme";
const SERVICE_TYPES = [
  { value: "", label: "Todos" },
  { value: "BANO", label: "Baños" },
  { value: "PARKING", label: "Parking" },
  { value: "GASTRONOMIA", label: "Gastronomía" },
  { value: "MERCH", label: "Merch" },
  { value: "PRIMEROS_AUXILIOS", label: "Primeros auxilios" },
];
export default function StadiumScreen() {
  const [info, setInfo] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [infoRes, sectorsRes, servicesRes] = await Promise.all([
          api.get("/stadium"),
          api.get("/stadium/sectors"),
          api.get("/stadium/services"),
        ]);
        if (!alive) return;
        setInfo(infoRes.data);
        setSectors(sectorsRes.data || []);
        setServices(servicesRes.data || []);
      } catch (err) {
        if (alive) setError("No se pudo cargar la información del estadio.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);
  const filteredServices = useMemo(() => {
    if (!serviceType) return services;
    return services.filter((item) => item.type === serviceType);
  }, [services, serviceType]);
  if (loading) return <LoadingSpinner />;
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Game Day</p>
          <h1 style={styles.title}>{info?.name || "Estadio Villa San Martín"}</h1>
          <p style={styles.subtitle}>
            {info?.address || "Saavedra 135"} · {info?.city || "Resistencia"}
          </p>
        </div>
        <div style={styles.capacityBox}>
          <span style={styles.capacityNumber}>{info?.capacity || "-"}</span>
          <span style={styles.capacityLabel}>capacidad</span>
        </div>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Sectores</h2>
        {sectors.length === 0 ? (
          <EmptyState message="No hay sectores cargados" />
        ) : (
          <div style={styles.grid}>
            {sectors.map((sector) => (
              <article key={sector.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span
                    style={{
                      ...styles.swatch,
                      backgroundColor: sector.colorHex || theme.colors.primary,
                    }}
                  />
                   <strong>{sector.name}</strong>
                </div>
                <p style={styles.muted}>{sector.type}</p>
                <p style={styles.row}>Puerta: {sector.gate || "Sin asignar"}</p>
                <p style={styles.row}>Capacidad: {sector.capacity || "-"}</p>
                {sector.description && <p style={styles.description}>{sector.description}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Servicios</h2>
          <select
            value={serviceType}
            onChange={(event) => setServiceType(event.target.value)}
            style={styles.select}
          >
            {SERVICE_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {filteredServices.length === 0 ? (
          <EmptyState message="No hay servicios para este filtro" />
        ) : (
          <div style={styles.list}>
            {filteredServices.map((service) => (
              <article key={service.id} style={styles.serviceRow}>
                <div>
                  <strong>{service.name}</strong>
                  <p style={styles.muted}>{service.type}</p>
                </div>
                <span style={styles.location}>{service.location || "Sin ubicación"}</span>
              </article>
            ))}
          </div>
        )}
      </section>
      {(info?.mapUrl || info?.parkingUrl) && (
        <section style={styles.actions}>
          {info.mapUrl && (
            <a href={info.mapUrl} target="_blank" rel="noreferrer" style={styles.linkButton}>
              Ver mapa
            </a>
          )}
          {info.parkingUrl && (
            <a href={info.parkingUrl} target="_blank" rel="noreferrer" style={styles.linkButton}>
              Ver parking
            </a>
          )}
        </section>
      )}
    </div>
  );
}
const styles = {
  page: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: "1.25rem",
    boxShadow: theme.shadows.card,
  },
  kicker: { margin: 0, color: theme.colors.secondary, fontWeight: 700 },
  title: { margin: "0.2rem 0", color: theme.colors.text, fontSize: theme.fontSizes.title },
  subtitle: { margin: 0, color: theme.colors.textMuted },
  capacityBox: {
    minWidth: "120px",
    padding: "0.75rem",
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    textAlign: "center",
  },
  capacityNumber: { display: "block", fontSize: theme.fontSizes.xxl, fontWeight: 800 },
  capacityLabel: { fontSize: theme.fontSizes.xs, textTransform: "uppercase" },
  section: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  sectionHeader: { display: "flex", justifyContent: "space-between", gap: "1rem", alignItems:
    "center" },
  sectionTitle: { margin: 0, color: theme.colors.text, fontSize: theme.fontSizes.xl },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap:
    "0.75rem" },
  card: {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: "1rem",
    boxShadow: theme.shadows.card,
  },
   cardHeader: { display: "flex", gap: "0.5rem", alignItems: "center" },
  swatch: { width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0 },
  muted: { margin: "0.25rem 0", color: theme.colors.textMuted, fontSize: theme.fontSizes.sm },
  row: { margin: "0.25rem 0", color: theme.colors.text },
  description: { margin: "0.5rem 0 0", color: theme.colors.textMuted, fontSize: theme.fontSizes.sm
    },
  select: { padding: "0.55rem", borderRadius: theme.borderRadius.md, border: `1px solid
    ${theme.colors.border}` },
  list: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  serviceRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: "0.9rem 1rem",
  },
  location: { color: theme.colors.textMuted, fontSize: theme.fontSizes.sm, textAlign: "right" },
  actions: { display: "flex", gap: "0.75rem", flexWrap: "wrap" },
  linkButton: {
    padding: "0.7rem 1rem",
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    textDecoration: "none",
    fontWeight: 700,
  },
  error: { color: theme.colors.error },
};
