import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { theme } from "../theme";
export default function PressCardScreen() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/press/${id}/card`);
        if (alive) setCard(response.data);
      } catch (err) {
        if (alive) setError("No se pudo cargar la credencial.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [id]);
  if (loading) return <LoadingSpinner />;
  if (error) {
    return <p style={styles.error}>{error}</p>;
  }
  return (
    <div style={styles.page}>
      <section style={styles.card}>
        <div style={styles.ribbon}>PRENSA</div>
        <p style={styles.kicker}>Credencial digital</p>
        <h1 style={styles.name}>{card?.journalistName}</h1>
        <p style={styles.media}>{card?.mediaName}</p>
        <p style={styles.role}>{card?.role}</p>
        <div style={styles.qrBox}>
          <span style={styles.qrText}>{card?.qrCode}</span>
        </div>
        <div style={styles.details}>
          <span>Sector: {card?.sector || "-"}</span>
          <span>Puerta: {card?.gate || "-"}</span>
          <span>Válida hasta: {formatDate(card?.validUntil)}</span>
        </div>
      </section>
    </div>
  );
}
function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
const styles = {
  page: { display: "flex", justifyContent: "center", padding: "1rem" },
  card: {
    width: "100%",
    maxWidth: "440px",
    position: "relative",
    overflow: "hidden",
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    padding: "1.5rem",
    boxShadow: theme.shadows.elevated,
  },
  ribbon: {
    position: "absolute",
    right: "-42px",
    top: "24px",
    transform: "rotate(35deg)",
    backgroundColor: theme.colors.error,
    color: theme.colors.white,
    fontWeight: 800,
    padding: "0.35rem 3rem",
    letterSpacing: "1px",
  },
  kicker: { margin: 0, color: theme.colors.secondary, fontWeight: 700, textTransform: "uppercase"
    },
  name: { margin: "0.35rem 0", color: theme.colors.text, fontSize: theme.fontSizes.title },
  media: { margin: 0, color: theme.colors.primary, fontWeight: 800 },
  role: { margin: "0.25rem 0 1rem", color: theme.colors.textMuted },
  qrBox: {
    minHeight: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: `2px dashed ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: "1rem",
    backgroundColor: theme.colors.background,
    wordBreak: "break-all",
  },
  qrText: { fontFamily: "monospace", color: theme.colors.text, textAlign: "center" },
  details: { marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem", color:
    theme.colors.text },
  error: { color: theme.colors.error },
};