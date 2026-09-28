import { useState } from "react";
import api from "../services/api";
import { theme } from "../theme";
const COVERAGE_OPTIONS = ["NOTA", "FOTO", "VIDEO", "STREAMING"];
export default function PressRequestScreen() {
  const [form, setForm] = useState({
    matchId: "",
    journalistName: "",
    mediaName: "",
    role: "",
    email: "",
    phone: "",
    coverageType: "NOTA",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");
  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);
    try {
      const response = await api.post("/press", {
        ...form,
        matchId: form.matchId ? Number(form.matchId) : null,
      });
      setSuccess(response.data);
      setForm({
        matchId: "",
        journalistName: "",
        mediaName: "",
        role: "",
        email: "",
        phone: "",
        coverageType: "NOTA",
      });
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <p style={styles.kicker}>Prensa</p>
        <h1 style={styles.title}>Solicitar acreditación</h1>
        <p style={styles.subtitle}>Completá los datos para cubrir un partido del club.</p>
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
          />
        </label>
        <label style={styles.label}>
          Nombre y apellido
          <input
            required
            value={form.journalistName}
            onChange={(event) => updateField("journalistName", event.target.value)}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Medio
          <input
            required
            value={form.mediaName}
            onChange={(event) => updateField("mediaName", event.target.value)}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Rol
          <input
            required
            value={form.role}
            onChange={(event) => updateField("role", event.target.value)}
            placeholder="Cronista, fotógrafo, productor..."
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Teléfono
          <input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Cobertura
          <select
            value={form.coverageType}
            onChange={(event) => updateField("coverageType", event.target.value)}
            style={styles.input}
          >
            {COVERAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <button type="submit" style={styles.primaryButton} disabled={loading}>
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
      {success && (
        <section style={styles.success}>
          <h2 style={styles.messageTitle}>Solicitud enviada</h2>
          <p>Estado: {success.status || "PENDING"}</p>
          <p>Guardá el número de solicitud: #{success.id}</p>
        </section>
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}
const styles = {
  page: { maxWidth: "820px", margin: "0 auto", display: "flex", flexDirection: "column", gap:
    "1rem" },
  header: { marginBottom: "0.25rem" },
  kicker: { margin: 0, color: theme.colors.secondary, fontWeight: 700 },
  title: { margin: "0.2rem 0", color: theme.colors.text, fontSize: theme.fontSizes.title },
  subtitle: { margin: 0, color: theme.colors.textMuted },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "0.9rem",
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: "1rem",
    boxShadow: theme.shadows.card,
  },
  label: { display: "flex", flexDirection: "column", gap: "0.35rem", fontWeight: 700, color:
    theme.colors.text },
  input: { padding: "0.7rem", borderRadius: theme.borderRadius.md, border: `1px solid
    ${theme.colors.border}` },
  primaryButton: {
    alignSelf: "end",
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    fontWeight: 700,
    cursor: "pointer",
  },
  success: {
    border: `1px solid ${theme.colors.success}`,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    padding: "1rem",
  },
  messageTitle: { margin: 0, color: theme.colors.success },
  error: { color: theme.colors.error, fontWeight: 700 },
};