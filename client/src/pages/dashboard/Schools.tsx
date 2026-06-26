/**
 * DOMUS Relocations — Client Dashboard: Schools
 */
import { trpc } from "@/lib/trpc";
import ClientDashboardLayout from "@/components/ClientDashboardLayout";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  shortlisted: { label: "Shortlisted", color: "#b49b6e" },
  applied: { label: "Applied", color: "#6b8fb4" },
  accepted: { label: "Accepted", color: "#6b9b6e" },
  rejected: { label: "Rejected", color: "#9b6b6b" },
  waitlisted: { label: "Waitlisted", color: "#9b8b6b" },
};

const TYPE_LABELS: Record<string, string> = {
  international: "International",
  bilingual: "Bilingual",
  local: "Local",
  montessori: "Montessori",
  other: "Other",
};

export default function DashboardSchools() {
  const schoolsQuery = trpc.clientDashboard.getMySchools.useQuery();
  const schools = schoolsQuery.data ?? [];

  return (
    <ClientDashboardLayout title="Schools">
      {/* Info banner */}
      <div style={{
        marginBottom: "2rem",
        padding: "1rem 1.5rem",
        backgroundColor: "rgba(180,155,110,0.06)",
        border: "1px solid rgba(180,155,110,0.2)",
        borderRadius: "2px",
        fontSize: "0.8rem",
        color: "#6b6b6b",
      }}>
        Your DOMUS advisor curates school options based on your children's ages, curriculum preferences, and location. Contact{" "}
        <a href="mailto:milano@domusrelocations.com" style={{ color: "#b49b6e" }}>
          milano@domusrelocations.com
        </a>{" "}
        to discuss your requirements.
      </div>

      {schoolsQuery.isLoading && (
        <div style={{ color: "#6b6b6b", fontSize: "0.875rem" }}>Loading schools…</div>
      )}

      {!schoolsQuery.isLoading && schools.length === 0 && (
        <div style={{
          padding: "3rem 2rem",
          textAlign: "center",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(180,155,110,0.15)",
          borderRadius: "2px",
        }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "1.125rem", color: "#1a1a1a", marginBottom: "0.5rem" }}>
            No school options yet
          </div>
          <p style={{ fontSize: "0.8rem", color: "#6b6b6b" }}>
            Your DOMUS advisor will add curated school options here.
          </p>
        </div>
      )}

      {schools.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {schools.map((school) => {
            const statusCfg = STATUS_CONFIG[school.status] ?? { label: school.status, color: "#6b6b6b" };
            return (
              <div key={school.id} style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(180,155,110,0.12)",
                borderRadius: "2px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: "#1a1a1a", flex: 1 }}>
                    {school.schoolName}
                  </div>
                  <span style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: statusCfg.color,
                    padding: "0.15rem 0.5rem",
                    border: `1px solid ${statusCfg.color}`,
                    borderRadius: "999px",
                    flexShrink: 0,
                  }}>
                    {statusCfg.label}
                  </span>
                </div>

                {/* Details */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {school.type && (
                    <span style={{ fontSize: "0.7rem", color: "#6b6b6b", backgroundColor: "rgba(0,0,0,0.04)", padding: "0.2rem 0.5rem", borderRadius: "2px" }}>
                      {TYPE_LABELS[school.type] ?? school.type}
                    </span>
                  )}
                  {school.curriculum && (
                    <span style={{ fontSize: "0.7rem", color: "#6b6b6b", backgroundColor: "rgba(0,0,0,0.04)", padding: "0.2rem 0.5rem", borderRadius: "2px" }}>
                      {school.curriculum}
                    </span>
                  )}
                  {school.ageRange && (
                    <span style={{ fontSize: "0.7rem", color: "#6b6b6b", backgroundColor: "rgba(0,0,0,0.04)", padding: "0.2rem 0.5rem", borderRadius: "2px" }}>
                      Ages: {school.ageRange}
                    </span>
                  )}
                </div>

                {school.location && (
                  <div style={{ fontSize: "0.75rem", color: "#b49b6e" }}>
                    📍 {school.location}
                  </div>
                )}

                {school.notes && (
                  <div style={{ fontSize: "0.75rem", color: "#6b6b6b", borderTop: "1px solid rgba(180,155,110,0.1)", paddingTop: "0.75rem" }}>
                    {school.notes}
                  </div>
                )}

                {school.website && (
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#b49b6e",
                      textDecoration: "none",
                      marginTop: "auto",
                    }}
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </ClientDashboardLayout>
  );
}
