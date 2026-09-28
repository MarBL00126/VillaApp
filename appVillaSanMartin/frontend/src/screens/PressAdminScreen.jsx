import { useEffect, useState } from "react";
import api from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { theme } from "../theme";
const STATUS_OPTIONS = ["", "PENDING", "APPROVED", "REJECTED", "REVOKED"];
export default function PressAdminScreen() {
  const [filters, setFilters] = useState({ matchId: "", status: "" });
  const [items, setItems] = useState([]);
  const [approval, setApproval] = useState({});
  const [rejectNote, setRejectNote] = useState({});
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filters.matchId) params.matchId = filters.matchId;
      if (filters.status) params.status = filters.status;
      const response = await api.get("/press/admin", { params });
      setItems(response.data || []);
    } catch (err) {
      setError("No se pudieron cargar las solicitudes de prensa.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }
  function updateApproval(id, name, value) {
    setApproval((current) => ({
      ...current,
      [id]: { ...current[id], [name]: value },
    }));
  }
  async function approve(id) {
    const data = approval[id] || {};
    setWorkingId(id);
    try {
      await api.patch(`/press/${id}/approve`, {
        sectorId: data.sectorId ? Number(data.sectorId) : null,
        gate: data.gate || null,
        validFrom: data.validFrom || null,
        validUntil: data.validUntil || null,
      });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo aprobar la acreditación.");
    } finally {
      setWorkingId(null);
    }
  }
  async function reject(id) {
    setWorkingId(id);
    try {
      await api.patch(`/press/${id}/reject`, { notes: rejectNote[id] || "Solicitud rechazada" });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo rechazar la acreditación.");
    } finally {
      setWorkingId(null);
    }
  }
  async function revoke(id) {
    setWorkingId(id);
    try {
      await api.patch(`/press/${id}/revoke`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo revocar la acreditación.");
    } finally {
      setWorkingId(null);
    }
  }
  function handleFilterSubmit(event) {
    event.preventDefault();
    load();
  }
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Admin</p>
          <h1 style={styles.title}>Acreditaciones de prensa</h1>
        </div>
        <form onSubmit={handleFilterSubmit} style={styles.filters}>
          <input
            type="number"
            min="1"
            value={filters.matchId}
            onChange={(event) => updateFilter("matchId", event.target.value)}
            placeholder="Partido ID"
            style={styles.input}
          />
          <select
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
            style={styles.input}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status || "ALL"} value={status}>
                {status || "Todos"}
              </option>
            ))}
          </select>
          <button type="submit" style={styles.primaryButton}>Filtrar</button>
        </form>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {loading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState message="No hay solicitudes con estos filtros" />
      ) : (
        <div style={styles.list}>
          {items.map((item) => (
            <article key={item.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <strong>{item.journalistName}</strong>
                  <p style={styles.muted}>{item.mediaName} · {item.role}</p>
                </div>
                <span style={statusStyle(item.status)}>{item.status}</span>
              </div>
              <div style={styles.metaGrid}>
                <span>Partido: {item.matchId || "-"}</span>
                <span>Email: {item.email}</span>
                <span>Cobertura: {item.coverageType}</span>
                <span>Teléfono: {item.phone || "-"}</span>
              </div>
              {item.status === "PENDING" && (
                <div style={styles.adminPanel}>
                  <input
                    type="number"
                    min="1"
                    placeholder="Sector ID"
                    value={approval[item.id]?.sectorId || ""}
                    onChange={(event) => updateApproval(item.id, "sectorId", event.target.value)}
                    style={styles.input}
                  />
                  <input
                    placeholder="Puerta"
                    value={approval[item.id]?.gate || ""}
                    onChange={(event) => updateApproval(item.id, "gate", event.target.value)}
                    style={styles.input}
                  />
                  <input
                    type="datetime-local"
                    value={approval[item.id]?.validFrom || ""}
                    onChange={(event) => updateApproval(item.id, "validFrom", event.target.value)}
                    style={styles.input}
                  />
                  <input
                    type="datetime-local"
                    value={approval[item.id]?.validUntil || ""}
                    onChange={(event) => updateApproval(item.id, "validUntil",
              event.target.value)}
                    style={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => approve(item.id)}
                    style={styles.successButton}
                    disabled={workingId === item.id}
                  >
                    Aprobar
                  </button>
                </div>
              )}
              {item.status === "PENDING" && (
                <div style={styles.rejectRow}>
                  <input
                    placeholder="Motivo de rechazo"
                    value={rejectNote[item.id] || ""}
                    onChange={(event) =>
                      setRejectNote((current) => ({ ...current, [item.id]: event.target.value }))
                    }
                    style={styles.input}
                    />
                  <button
                    type="button"
                    onClick={() => reject(item.id)}
                    style={styles.dangerButton}
                    disabled={workingId === item.id}
                  >
                    Rechazar
                  </button>
                </div>
              )}
              {item.status === "APPROVED" && (
                <button
                  type="button"
                  onClick={() => revoke(item.id)}
                  style={styles.dangerButton}
                  disabled={workingId === item.id}
                >
                  Revocar credencial
                </button>
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
  header: { display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap",
    alignItems: "center" },
  kicker: { margin: 0, color: theme.colors.secondary, fontWeight: 700 },
  title: { margin: "0.2rem 0", color: theme.colors.text, fontSize: theme.fontSizes.title },
  filters: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
  input: { padding: "0.65rem", borderRadius: theme.borderRadius.md, border: `1px solid
    ${theme.colors.border}` },
  primaryButton: {
    padding: "0.65rem 1rem",
    border: "none",
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    fontWeight: 700,
    cursor: "pointer",
  },
  successButton: {
    padding: "0.65rem 1rem",
    border: "none",
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.success,
    color: theme.colors.white,
    fontWeight: 700,
    cursor: "pointer",
  },
  dangerButton: {
    padding: "0.65rem 1rem",
    border: "none",
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.error,
    color: theme.colors.white,
    fontWeight: 700,
    cursor: "pointer",
  },
  list: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  card: {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: "1rem",
    boxShadow: theme.shadows.card,
  },
  cardTop: { display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center"
    },
  muted: { margin: "0.25rem 0", color: theme.colors.textMuted },
  metaGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap:
    "0.45rem", marginTop: "0.75rem" },
  adminPanel: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap:
    "0.5rem", marginTop: "0.85rem" },
  rejectRow: { display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" },
  error: { color: theme.colors.error },
};