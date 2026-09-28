import { useState } from "react";
import api from "../services/api";
import { theme } from "../theme";
export default function AccessScanScreen() {
  const [form, setForm] = useState({
    qrCode: "",
    gate: "",
    matchId: "",
    deviceId: "web-admin",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.qrCode.trim() || !form.matchId) {
      setError("Ingresá QR y partido.");
      setResult(null);
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await api.post("/access/scan", {
        qrCode: form.qrCode.trim(),
        gate: form.gate.trim() || null,
        matchId: Number(form.matchId),
        deviceId: form.deviceId.trim() || "web-admin",
      });
      setResult(response.data);
      if (response.data?.ok) {
        setForm((current) => ({ ...current, qrCode: "" }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo validar el acceso.");
    } finally {
      setLoading(false);
    }
  }
  function clear() {
    setForm((current) => ({ ...current, qrCode: "" }));
    setResult(null);
    setError("");
  }
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <p style={styles.kicker}>Admin</p>
        <h1 style={styles.title}>Control de acceso</h1>
        <p style={styles.subtitle}>Valida tickets y credenciales de prensa para un partido.</p>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Partido ID
          <input
            type="number"
            min="1"
            value={form.matchId}
            onChange={(event) => updateField("matchId", event.target.value)}
            style={styles.input}
            disabled={loading}
          />
        </label>
        <label style={styles.label}>
          Puerta
          <input
            value={form.gate}
            onChange={(event) => updateField("gate", event.target.value)}
            placeholder="Ej: Puerta A"
            style={styles.input}
            disabled={loading}
          />
        </label>
        <label style={styles.label}>
          Dispositivo
          <input
            value={form.deviceId}
            onChange={(event) => updateField("deviceId", event.target.value)}
            style={styles.input}
            disabled={loading}
          />
        </label>
        <label style={styles.labelFull}>
          Código QR
          <textarea
            value={form.qrCode}
            onChange={(event) => updateField("qrCode", event.target.value)}
            placeholder="Pegá o escaneá el QR"
            rows={4}
            style={{ ...styles.input, resize: "vertical" }}
            disabled={loading}
          />
        </label>
        <div style={styles.actions}>
          <button type="submit" style={styles.primaryButton} disabled={loading}>
            {loading ? "Validando..." : "Validar acceso"}
          </button>
          <button type="button" onClick={clear} style={styles.secondaryButton} disabled={loading}>
            Limpiar
          </button>
        </div>
      </form>
      {result && (
        <section
          style={{
            ...styles.result,
            borderColor: result.ok ? theme.colors.success : theme.colors.error,
          }}
        >
          <h2 style={styles.resultTitle}>
            {result.ok ? "Ingreso OK" : "Acceso rechazado"}
          </h2>
          <p style={styles.status}>{result.status}</p>
          <p>{result.message}</p>
          <div style={styles.resultGrid}>
            <span>Nombre: {result.name || "-"}</span>
            <span>Sector: {result.sector || "-"}</span>
            <span>Puerta: {result.gate || form.gate || "-"}</span>
          </div>
        </section>
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}
const styles = {
  page: { maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap:
    "1rem" },
  header: { marginBottom: "0.25rem" },
  kicker: { margin: 0, color: theme.colors.secondary, fontWeight: 700 },
  title: { margin: "0.2rem 0", color: theme.colors.text, fontSize: theme.fontSizes.title },
  subtitle: { margin: 0, color: theme.colors.textMuted },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "0.9rem",
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: "1rem",
    boxShadow: theme.shadows.card,
  },
  label: { display: "flex", flexDirection: "column", gap: "0.35rem", fontWeight: 700, color:
    theme.colors.text },
  labelFull: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    fontWeight: 700,
    color: theme.colors.text,
  },
  input: {
    padding: "0.7rem",
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    fontSize: theme.fontSizes.md,
  },
  actions: { gridColumn: "1 / -1", display: "flex", gap: "0.75rem", flexWrap: "wrap" },
  primaryButton: {
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "0.75rem 1rem",
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    cursor: "pointer",
  },
  result: {
    border: "2px solid",
    borderRadius: theme.borderRadius.md,
    padding: "1rem",
    backgroundColor: theme.colors.surface,
    boxShadow: theme.shadows.card,
  },
  resultTitle: { margin: 0, color: theme.colors.text },
  status: { margin: "0.25rem 0", color: theme.colors.textMuted, fontWeight: 700 },
  resultGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap:
    "0.5rem" },
  error: { color: theme.colors.error, fontWeight: 700 },
};
