/**
 * DOMUS Relocations — Client Dashboard: My Checklist
 */
import { trpc } from "@/lib/trpc";
import ClientDashboardLayout from "@/components/ClientDashboardLayout";

export default function DashboardChecklist() {
  const utils = trpc.useUtils();
  const checklistQuery = trpc.clientDashboard.getMyChecklist.useQuery();
  const toggleMutation = trpc.clientDashboard.toggleChecklistItem.useMutation({
    onSuccess: () => utils.clientDashboard.getMyChecklist.invalidate(),
  });

  const items = checklistQuery.data ?? [];
  const completed = items.filter((i) => i.isCompleted).length;
  const total = items.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Group by category
  const categories = Array.from(new Set(items.map((i) => i.category ?? "General")));

  return (
    <ClientDashboardLayout title="My Checklist">
      {/* Progress bar */}
      {total > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "#6b6b6b", textTransform: "uppercase" }}>
              Progress
            </span>
            <span style={{ fontSize: "0.875rem", color: "#b49b6e", fontFamily: "Georgia, serif" }}>
              {completed} / {total} completed ({pct}%)
            </span>
          </div>
          <div style={{ height: "4px", backgroundColor: "rgba(180,155,110,0.15)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              backgroundColor: "#b49b6e",
              borderRadius: "2px",
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>
      )}

      {checklistQuery.isLoading && (
        <div style={{ color: "#6b6b6b", fontSize: "0.875rem" }}>Loading checklist…</div>
      )}

      {!checklistQuery.isLoading && items.length === 0 && (
        <div style={{
          padding: "3rem 2rem",
          textAlign: "center",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(180,155,110,0.15)",
          borderRadius: "2px",
        }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "1.125rem", color: "#1a1a1a", marginBottom: "0.5rem" }}>
            Your checklist is being prepared
          </div>
          <p style={{ fontSize: "0.8rem", color: "#6b6b6b" }}>
            Your DOMUS advisor will add personalised tasks here shortly.
          </p>
        </div>
      )}

      {categories.map((category) => {
        const categoryItems = items.filter((i) => (i.category ?? "General") === category);
        return (
          <div key={category} style={{ marginBottom: "2rem" }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#b49b6e", marginBottom: "0.75rem" }}>
              {category}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(180,155,110,0.12)",
                    borderRadius: "2px",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                  onClick={() => toggleMutation.mutate({ itemId: item.id, isCompleted: !item.isCompleted })}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(180,155,110,0.3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(180,155,110,0.12)")}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "2px",
                    border: item.isCompleted ? "none" : "1.5px solid rgba(180,155,110,0.5)",
                    backgroundColor: item.isCompleted ? "#b49b6e" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                    transition: "all 0.2s",
                  }}>
                    {item.isCompleted && <span style={{ color: "#ffffff", fontSize: "0.7rem" }}>✓</span>}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: "0.875rem",
                      color: item.isCompleted ? "#9b9b9b" : "#1a1a1a",
                      textDecoration: item.isCompleted ? "line-through" : "none",
                      fontWeight: item.isCompleted ? 300 : 400,
                    }}>
                      {item.title}
                    </div>
                    {item.description && (
                      <div style={{ fontSize: "0.75rem", color: "#6b6b6b", marginTop: "0.25rem" }}>
                        {item.description}
                      </div>
                    )}
                    {item.dueDate && (
                      <div style={{ fontSize: "0.7rem", color: "#b49b6e", marginTop: "0.25rem" }}>
                        Due: {new Date(item.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    )}
                  </div>

                  {/* Completed badge */}
                  {item.isCompleted && item.completedAt && (
                    <div style={{ fontSize: "0.65rem", color: "#9b9b9b", flexShrink: 0 }}>
                      {new Date(item.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </ClientDashboardLayout>
  );
}
