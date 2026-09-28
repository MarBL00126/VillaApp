import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { theme } from "../theme";
export default function AccessLogsScreen() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [selectedMatchId, setSelectedMatchId] = useState(matchId || "");
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(Boolean(matchId));
  const [error, setError] = useState("");
  useEffect(() => {
    if (!matchId) return;
    let alive = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [logsRes, summaryRes] = await Promise.all([
          api.get(`/access/logs/${matchId}`),
          api.get(`/access/logs/${matchId}/summary`),
        ]);
        if (!alive) return;
        setLogs(logsRes.data || []);
        setSummary(summaryRes.data || null);
      } catch (err) {
        if (alive) setError("No se pudieron cargar los accesos del partido.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [matchId]);
  const statusCounts = useMemo(() => {
    return logs.reduce((acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1;
      return acc;
    }, {});
  }, [logs]);
  function handleSearch(event) {
    event.preventDefault();
    if (selectedMatchId) navigate(`/admin/access/logs/${selectedMatchId}`);
  }
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Admin</p>
          <h1 style={styles.title}>Historial de accesos</h1>
        </div>
        <form onSubmit={handleSearch} style={styles.search}>
          <input
            type="number"
            min="1"
            value={selectedMatchId}
            onChange={(event) => setSelectedMatchId(event.target.value)}
            placeholder="Partido ID"
            style={styles.input}
          />
          <button type="submit" style={styles.primaryButton}>Buscar</button>
        </form>
      </div>
      {!matchId ? (
        <EmptyState message="Ingresá un partido para ver el historial" />
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {error && <p style={styles.error}>{error}</p>}
          <section style={styles.summaryGrid}>
            <SummaryCard label="Total" value={summary?.total ?? logs.length} />
            <SummaryCard label="OK" value={summary?.ok ?? statusCounts.OK ?? 0} tone="success" />
            <SummaryCard label="Duplicados" value={summary?.duplicates ?? statusCounts.DUPLICATE
              ?? 0} />
            <SummaryCard label="Inválidos" value={summary?.invalid ?? statusCounts.INVALID ?? 0}
              tone="error" />
          </section>
          {logs.length === 0 ? (
            <EmptyState message="No hay accesos registrados para este partido" />
          ) : (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Fecha</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Puerta</th>
                    <th style={styles.th}>Usuario</th>
                    <th style={styles.th}>Ticket</th>
                    <th style={styles.th}>Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td style={styles.td}>{formatDate(log.scannedAt)}</td>
                      <td style={styles.td}>
                        <span style={statusBadge(log.status)}>{log.status}</span>
                      </td>
                      <td style={styles.td}>{log.gate || "-"}</td>
                      <td style={styles.td}>{log.userId || "-"}</td>
                      <td style={styles.td}>{log.ticketId || "-"}</td>
                      <td style={styles.td}>{log.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
function SummaryCard({ label, value, tone }) {
  const color = tone === "success" ? theme.colors.success : tone === "error" ? theme.colors.error
    : theme.colors.primary;
  return (
    <article style={styles.summaryCard}>
      <span style={styles.summaryLabel}>{label}</span>
      <strong style={{ ...styles.summaryValue, color }}>{value}</strong>
    </article>
  );
}
function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function statusBadge(status) {
  const ok = status === "OK";
  const bad = ["INVALID", "EXPIRED", "WRONG_MATCH"].includes(status);
  return {
    display: "inline-block",
    padding: "0.2rem 0.5rem",
    borderRadius: theme.borderRadius.full,
    color: theme.colors.white,
    backgroundColor: ok ? theme.colors.success : bad ? theme.colors.error :
      theme.colors.secondary,
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
  search: { display: "flex", gap: "0.5rem" },
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
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "0.75rem" },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: "1rem",
    boxShadow: theme.shadows.card,
  },
  summaryLabel: { color: theme.colors.textMuted, fontSize: theme.fontSizes.sm },
  summaryValue: { display: "block", marginTop: "0.25rem", fontSize: theme.fontSizes.xxl },
  tableWrap: { overflowX: "auto", backgroundColor: theme.colors.surface, borderRadius:
    theme.borderRadius.md },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "760px" },
  th: { padding: "0.75rem", textAlign: "left", borderBottom: `1px solid ${theme.colors.border}`,
    color: theme.colors.textMuted },
  td: { padding: "0.75rem", borderBottom: `1px solid ${theme.colors.border}`, color:
    theme.colors.text },
    error: { color: theme.colors.error },
};