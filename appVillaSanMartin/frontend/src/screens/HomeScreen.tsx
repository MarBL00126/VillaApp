import { useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { MatchCard } from "../components/MatchCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { theme } from "../theme";
import type { Match, PlayerStats } from "../types";

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

export function HomeScreen() {
  const navigate = useNavigate();
  const { data: fixture, loading: l1, error: e1, refetch } = useFetch<Match[]>("/fixture");
  const { data: allMatches, loading: l2 } = useFetch<Match[]>("/matches");
  const { data: stats, loading: l3 } = useFetch<PlayerStats[]>("/stats");

  const loading = l1 || l2 || l3;

  const nextMatch = fixture?.[0] ?? null;

  const lastResult = allMatches
    ? [...allMatches]
        .filter((m) => isPast(m.matchDate))
        .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())[0] ?? null
    : null;

  const leaders = stats
    ? {
        points: [...stats].sort((a, b) => b.totalPoints - a.totalPoints)[0],
        rebounds: [...stats].sort((a, b) => b.totalRebounds - a.totalRebounds)[0],
        assists: [...stats].sort((a, b) => b.totalAssists - a.totalAssists)[0],
      }
    : null;

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>Club Villa San Mart�n</h1>
          <p style={styles.heroSub}>Baloncesto</p>
        </div>
        <button onClick={refetch} style={styles.refreshBtn} title="Actualizar">
          ? Actualizar
        </button>
      </div>

      {e1 && <p style={styles.error}>{e1}</p>}

      {/* Pr�ximo y �ltimo */}
      <div style={styles.row}>
        <div style={styles.col}>
          <h2 style={styles.sectionTitle}>Pr�ximo partido</h2>
          {nextMatch ? <MatchCard match={nextMatch} /> : <EmptyState message="Sin pr�ximos partidos" />}
        </div>
        <div style={styles.col}>
          <h2 style={styles.sectionTitle}>�ltimo resultado</h2>
          {lastResult ? <MatchCard match={lastResult} /> : <EmptyState message="Sin resultados" />}
        </div>
      </div>

      {/* L�deres */}
      {leaders && (
        <div>
          <h2 style={styles.sectionTitle}>L�deres</h2>
          <div style={styles.leadersRow}>
            {[
              { label: "Puntos", stat: leaders.points, value: leaders.points?.totalPoints },
              { label: "Rebotes", stat: leaders.rebounds, value: leaders.rebounds?.totalRebounds },
              { label: "Asistencias", stat: leaders.assists, value: leaders.assists?.totalAssists },
            ].map(({ label, stat, value }) => (
              <div key={label} style={styles.leaderCard}>
                <span style={styles.leaderLabel}>{label}</span>
                <span style={styles.leaderName}>
                  {stat ? `${stat.player.name} ${stat.player.surname}` : "�"}
                </span>
                <span style={styles.leaderValue}>{value ?? "�"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accesos r�pidos */}
      <h2 style={styles.sectionTitle}>Accesos r�pidos</h2>
      <div style={styles.quickLinks}>
        <button onClick={() => navigate("/players")} style={styles.linkBtn}>?? Plantel</button>
        <button onClick={() => navigate("/fixture")} style={styles.linkBtn}>?? Fixture</button>
        <button onClick={() => navigate("/stats")} style={styles.linkBtn}>?? Estad�sticas</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  hero: {
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #1a3a7a 100%)`,
    borderRadius: theme.borderRadius.lg,
    padding: "1.5rem",
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroTitle: { color: theme.colors.white, margin: 0, fontSize: theme.fontSizes.xxl, fontWeight: 700 },
  heroSub: { color: theme.colors.secondary, margin: "0.25rem 0 0", fontWeight: 600 },
  refreshBtn: {
    background: "rgba(255,255,255,0.1)",
    border: `1px solid ${theme.colors.secondary}`,
    color: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: "0.4rem 1rem",
    cursor: "pointer",
    fontSize: theme.fontSizes.sm,
    fontWeight: 600,
  },
  error: { color: theme.colors.error, fontSize: theme.fontSizes.sm, marginBottom: "1rem" },
  row: { display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" as const },
  col: { flex: 1, minWidth: "260px" },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
    marginBottom: "0.75rem",
    marginTop: "1.25rem",
  },
  leadersRow: { display: "flex", gap: "1rem", flexWrap: "wrap" as const, marginBottom: "1.5rem" },
  leaderCard: {
    flex: 1,
    minWidth: "140px",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: "1rem",
    boxShadow: theme.shadows.card,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "0.25rem",
    border: `1px solid ${theme.colors.border}`,
  },
  leaderLabel: { fontSize: theme.fontSizes.xs, color: theme.colors.textMuted, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em" },
  leaderName: { fontSize: theme.fontSizes.sm, fontWeight: 700, color: theme.colors.text, textAlign: "center" as const },
  leaderValue: { fontSize: theme.fontSizes.xxl, fontWeight: 700, color: theme.colors.primary },
  quickLinks: { display: "flex", gap: "1rem", flexWrap: "wrap" as const },
  linkBtn: {
    flex: 1,
    minWidth: "120px",
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    border: "none",
    borderRadius: theme.borderRadius.md,
    padding: "0.875rem",
    cursor: "pointer",
    fontSize: theme.fontSizes.md,
    fontWeight: 600,
  },
};
