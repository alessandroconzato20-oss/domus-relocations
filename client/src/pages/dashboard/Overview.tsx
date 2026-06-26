/**
 * DOMUS Relocations — Client Dashboard Overview
 */
import { trpc } from "@/lib/trpc";
import ClientDashboardLayout from "@/components/ClientDashboardLayout";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      backgroundColor: "#ffffff",
      border: "1px solid rgba(180,155,110,0.15)",
      borderRadius: "2px",
      padding: "1.5rem",
    }}>
      <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b49b6e", marginBottom: "0.5rem" }}>
        {label}
      </div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 300, color: "#1a1a1a" }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: "0.75rem", color: "#6b6b6b", marginTop: "0.25rem" }}>{sub}</div>}
    </div>
  );
}

export default function DashboardOverview() {
  const profileQuery = trpc.clientDashboard.getMyProfile.useQuery();
  const checklistQuery = trpc.clientDashboard.getMyChecklist.useQuery();
  const appointmentsQuery = trpc.clientDashboard.getMyAppointments.useQuery();
  const documentsQuery = trpc.clientDashboard.getMyDocuments.useQuery();
  const unreadQuery = trpc.clientDashboard.getUnreadCount.useQuery();

  const profile = profileQuery.data;
  const checklist = checklistQuery.data ?? [];
  const appointments = appointmentsQuery.data ?? [];
  const documents = documentsQuery.data ?? [];
  const unreadCount = unreadQuery.data?.count ?? 0;

  const completedItems = checklist.filter((i) => i.isCompleted).length;
  const totalItems = checklist.length;
  const completionPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const upcomingAppts = appointments.filter((a) => {
    const d = new Date(a.appointmentDate);
    return d >= new Date() && a.status !== "cancelled";
  });

  if (profileQuery.isLoading) {
    return (
      <ClientDashboardLayout title="Overview">
        <div style={{ color: "#6b6b6b", fontSize: "0.875rem" }}>Loading your profile…</div>
      </ClientDashboardLayout>
    );
  }

  if (profileQuery.error) {
    return (
      <ClientDashboardLayout title="Overview">
        <div style={{
          padding: "2rem",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(180,155,110,0.2)",
          borderRadius: "2px",
          textAlign: "center",
        }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "1.25rem", color: "#1a1a1a", marginBottom: "0.75rem" }}>
            Your profile is being prepared
          </div>
          <p style={{ fontSize: "0.875rem", color: "#6b6b6b", maxWidth: "400px", margin: "0 auto" }}>
            Your DOMUS advisor is setting up your private client portal. You will receive an email once your profile is ready.
          </p>
          <p style={{ fontSize: "0.75rem", color: "#b49b6e", marginTop: "1.5rem" }}>
            Questions? Contact us at{" "}
            <a href="mailto:milano@domusrelocations.com" style={{ color: "#b49b6e" }}>
              milano@domusrelocations.com
            </a>
          </p>
        </div>
      </ClientDashboardLayout>
    );
  }

  return (
    <ClientDashboardLayout title="Overview">
      {/* Welcome banner */}
      <div style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "2px",
        padding: "1.75rem 2rem",
        marginBottom: "2rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "40%",
          background: "linear-gradient(to left, rgba(180,155,110,0.08), transparent)",
        }} />
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b49b6e", marginBottom: "0.5rem" }}>
          {profile?.servicePackage?.toUpperCase() ?? "STANDARD"} Package
        </div>
        <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 300, fontSize: "1.5rem", color: "#ffffff", marginBottom: "0.25rem" }}>
          Welcome, {profile?.fullName?.split(" ")[0] ?? "Client"}
        </h2>
        <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
          Your DOMUS relocation journey is underway.
          {profile?.targetMoveDate && ` Target move: ${profile.targetMoveDate}.`}
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard label="Checklist Progress" value={`${completionPct}%`} sub={`${completedItems} of ${totalItems} tasks done`} />
        <StatCard label="Upcoming Appointments" value={upcomingAppts.length} sub={upcomingAppts.length === 1 ? "1 scheduled" : `${upcomingAppts.length} scheduled`} />
        <StatCard label="Documents" value={documents.length} sub="files in your portal" />
        {unreadCount > 0 && (
          <StatCard label="New Messages" value={unreadCount} sub="from your advisor" />
        )}
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="grid-cols-1 md:grid-cols-2">
        {/* Next appointment */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.15)", borderRadius: "2px", padding: "1.5rem" }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b49b6e", marginBottom: "1rem" }}>
            Next Appointment
          </div>
          {upcomingAppts.length > 0 ? (
            <div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: "#1a1a1a", marginBottom: "0.25rem" }}>
                {upcomingAppts[0].title}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b6b6b" }}>
                {new Date(upcomingAppts[0].appointmentDate).toLocaleDateString("en-GB", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric"
                })}
              </div>
              {upcomingAppts[0].location && (
                <div style={{ fontSize: "0.75rem", color: "#b49b6e", marginTop: "0.25rem" }}>
                  {upcomingAppts[0].location}
                </div>
              )}
            </div>
          ) : (
            <p style={{ fontSize: "0.8rem", color: "#9b9b9b" }}>No upcoming appointments scheduled.</p>
          )}
          <a href="/dashboard/appointments" style={{ display: "inline-block", marginTop: "1rem", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#b49b6e", textDecoration: "none" }}>
            View all →
          </a>
        </div>

        {/* Recent checklist */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.15)", borderRadius: "2px", padding: "1.5rem" }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b49b6e", marginBottom: "1rem" }}>
            Checklist
          </div>
          {checklist.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {checklist.slice(0, 4).map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "2px",
                    border: item.isCompleted ? "none" : "1px solid rgba(180,155,110,0.4)",
                    backgroundColor: item.isCompleted ? "#b49b6e" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {item.isCompleted && <span style={{ color: "#ffffff", fontSize: "0.6rem" }}>✓</span>}
                  </div>
                  <span style={{ fontSize: "0.8rem", color: item.isCompleted ? "#9b9b9b" : "#1a1a1a", textDecoration: item.isCompleted ? "line-through" : "none" }}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.8rem", color: "#9b9b9b" }}>No checklist items yet.</p>
          )}
          <a href="/dashboard/checklist" style={{ display: "inline-block", marginTop: "1rem", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#b49b6e", textDecoration: "none" }}>
            View all →
          </a>
        </div>
      </div>

      {/* Profile details */}
      {profile && (
        <div style={{ marginTop: "1.5rem", backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.15)", borderRadius: "2px", padding: "1.5rem" }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b49b6e", marginBottom: "1rem" }}>
            Your Profile
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              { label: "Full Name", value: profile.fullName },
              { label: "Email", value: profile.email },
              { label: "Phone", value: profile.phone },
              { label: "Nationality", value: profile.nationality },
              { label: "Current City", value: profile.currentCity },
              { label: "Target Move Date", value: profile.targetMoveDate },
            ].filter((f) => f.value).map((field) => (
              <div key={field.label}>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9b9b9b", marginBottom: "0.25rem" }}>
                  {field.label}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#1a1a1a" }}>{field.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ClientDashboardLayout>
  );
}
