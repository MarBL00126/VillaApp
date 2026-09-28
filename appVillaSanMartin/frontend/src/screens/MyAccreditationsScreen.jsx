import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { theme } from "../theme";
export default function MyAccreditationsScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/press/my");
        if (alive) setItems(response.data || []);
      } catch (err) {
        if (alive) setError("No se pudieron cargar tus acreditaciones.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);
  if (loading) return <LoadingSpinner />;
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <p style={styles.kicker}>Prensa</p>
        <h1 style={styles.title}>Mis acreditaciones</h1>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {items.length === 0 ? (
        <EmptyState message="Todavía no tenés solicitudes de prensa" />
      ) : (
        <div style={styles.list}>
          {items.map((item) => (
            <article key={item.id} style={styles.card}>
              <div>
                <div style={styles.cardTop}>
                  <strong>{item.mediaName}</strong>
                  <span style={statusStyle(item.status)}>{item.status}</span>
                </div>
                <p style={styles.muted}>{item.journalistName} · {item.role}</p>
                <p style={styles.row}>Partido: {item.matchId || "-"}</p>
                <p style={styles.row}>Cobertura: {item.coverageType}</p>
                {item.notes && <p style={styles.note}>Nota: {item.notes}</p>}
              </div>
              {item.status === "APPROVED" && (
                <Link to={`/press/${item.id}/card`} style={styles.cardButton}>
                  Ver credencial
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
function statusStyle(status) {
  const colors = {
    APPROVED: theme.colors.success,
    REJECTED: theme.colors.error,
    REVOKED: theme.colors.textMuted,
    PENDING: theme.colors.secondary,
  };
  return {
    padding: "0.25rem 0.55rem",
    borderRadius: theme.borderRadius.full,
    color: theme.colors.white,
    backgroundColor: colors[status] || theme.colors.textMuted,
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  };
}
const styles = {
  page: { display: "flex", flexDirection: "column", gap: "1rem" },
  header: { marginBottom: "0.25rem" },
  kicker: { margin: 0, color: theme.colors.secondary, fontWeight: 700 },
  title: { margin: "0.2rem 0", color: theme.colors.text, fontSize: theme.fontSizes.title },
  list: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  card: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: "1rem",
    boxShadow: theme.shadows.card,
  },
  cardTop: { display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" },
  muted: { margin: "0.35rem 0", color: theme.colors.textMuted },
  row: { margin: "0.2rem 0", color: theme.colors.text },
  note: { margin: "0.5rem 0 0", color: theme.colors.error },
  cardButton: {
    padding: "0.65rem 0.9rem",
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    textDecoration: "none",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  error: { color: theme.colors.error },
};