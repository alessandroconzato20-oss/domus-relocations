/**
 * DOMUS Relocations — Client Dashboard: Appointments
 */
import { trpc } from "@/lib/trpc";
import ClientDashboardLayout from "@/components/ClientDashboardLayout";

const TYPE_LABELS: Record<string, string> = {
  call: "Phone Call",
  viewing: "Property Viewing",
  meeting: "Meeting",
  school_visit: "School Visit",
  other: "Appointment",
};

const STATUS_COLORS: Record<string, string> = {
  scheduled: "#b49b6e",
  completed: "#6b9b6e",
  cancelled: "#9b6b6b",
};

export default function DashboardAppointments() {
  const apptQuery = trpc.clientDashboard.getMyAppointments.useQuery();
  const appointments = apptQuery.data ?? [];

  const now = new Date();
  const upcoming = appointments
    .filter((a) => new Date(a.appointmentDate) >= now && a.status !== "cancelled")
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  const past = appointments
    .filter((a) => new Date(a.appointmentDate) < now || a.status === "cancelled")
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  const AppointmentCard = ({ appt }: { appt: typeof appointments[0] }) => {
    const date = new Date(appt.appointmentDate);
    const isUpcoming = date >= now && appt.status !== "cancelled";
    return (
      <div style={{
        display: "flex",
        gap: "1.25rem",
        padding: "1.25rem",
        backgroundColor: "#ffffff",
        border: "1px solid rgba(180,155,110,0.12)",
        borderRadius: "2px",
        opacity: isUpcoming ? 1 : 0.7,
      }}>
        {/* Date block */}
        <div style={{
          flexShrink: 0,
          width: "56px",
          textAlign: "center",
          padding: "0.5rem",
          backgroundColor: isUpcoming ? "rgba(180,155,110,0.08)" : "rgba(0,0,0,0.03)",
          borderRadius: "2px",
        }}>
          <div style={{ fontSize: "1.25rem", fontFamily: "Georgia, serif", color: "#1a1a1a", lineHeight: 1 }}>
            {date.getDate()}
          </div>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6b6b", marginTop: "0.125rem" }}>
            {date.toLocaleDateString("en-GB", { month: "short" })}
          </div>
          <div style={{ fontSize: "0.65rem", color: "#9b9b9b" }}>
            {date.getFullYear()}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "0.875rem", color: "#1a1a1a", fontWeight: 500 }}>
              {appt.title}
            </span>
            <span style={{
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: STATUS_COLORS[appt.status] ?? "#6b6b6b",
              padding: "0.1rem 0.5rem",
              border: `1px solid ${STATUS_COLORS[appt.status] ?? "#6b6b6b"}`,
              borderRadius: "999px",
            }}>
              {appt.status}
            </span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#6b6b6b" }}>
            {TYPE_LABELS[appt.type] ?? appt.type}
            {" · "}
            {date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </div>
          {appt.location && (
            <div style={{ fontSize: "0.75rem", color: "#b49b6e", marginTop: "0.25rem" }}>
              📍 {appt.location}
            </div>
          )}
          {appt.description && (
            <div style={{ fontSize: "0.75rem", color: "#6b6b6b", marginTop: "0.375rem" }}>
              {appt.description}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ClientDashboardLayout title="Appointments">
      {apptQuery.isLoading && (
        <div style={{ color: "#6b6b6b", fontSize: "0.875rem" }}>Loading appointments…</div>
      )}

      {!apptQuery.isLoading && appointments.length === 0 && (
        <div style={{
          padding: "3rem 2rem",
          textAlign: "center",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(180,155,110,0.15)",
          borderRadius: "2px",
        }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "1.125rem", color: "#1a1a1a", marginBottom: "0.5rem" }}>
            No appointments scheduled
          </div>
          <p style={{ fontSize: "0.8rem", color: "#6b6b6b" }}>
            Your DOMUS advisor will schedule appointments here. Contact{" "}
            <a href="mailto:milano@domusrelocations.com" style={{ color: "#b49b6e" }}>
              milano@domusrelocations.com
            </a>{" "}
            to arrange a meeting.
          </p>
        </div>
      )}

      {upcoming.length > 0 && (
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#b49b6e", marginBottom: "0.75rem" }}>
            Upcoming
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {upcoming.map((a) => <AppointmentCard key={a.id} appt={a} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#9b9b9b", marginBottom: "0.75rem" }}>
            Past
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {past.map((a) => <AppointmentCard key={a.id} appt={a} />)}
          </div>
        </div>
      )}
    </ClientDashboardLayout>
  );
}
