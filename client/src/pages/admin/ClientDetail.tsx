/**
 * DOMUS Relocations — Admin: Client Detail
 * Full management of a single client's profile, checklist, documents, appointments, schools, messages
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import type { ClientProfile, ChecklistItem, Document, Appointment, SchoolOption, Message } from "@shared/types";

// Composite type returned by getClientFull
type ClientFull = {
  profile: ClientProfile;
  checklist: ChecklistItem[];
  documents: Document[];
  appointments: Appointment[];
  schools: SchoolOption[];
  messages: Message[];
};

type Tab = "overview" | "checklist" | "documents" | "appointments" | "schools" | "messages";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  backgroundColor: "#f9f6f1",
  border: "1px solid rgba(180,155,110,0.3)",
  borderRadius: "2px",
  fontSize: "0.875rem",
  color: "#1a1a1a",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.65rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#6b6b6b",
  marginBottom: "0.375rem",
};

const btnPrimary: React.CSSProperties = {
  padding: "0.6rem 1.25rem",
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  border: "none",
  borderRadius: "2px",
  fontSize: "0.7rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const btnGold: React.CSSProperties = {
  padding: "0.6rem 1.25rem",
  backgroundColor: "#b49b6e",
  color: "#ffffff",
  border: "none",
  borderRadius: "2px",
  fontSize: "0.7rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const btnDanger: React.CSSProperties = {
  padding: "0.4rem 0.75rem",
  backgroundColor: "transparent",
  color: "#9b6b6b",
  border: "1px solid rgba(155,107,107,0.3)",
  borderRadius: "2px",
  fontSize: "0.65rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  cursor: "pointer",
};

export default function AdminClientDetail() {
  const params = useParams<{ id: string }>();
  const clientId = parseInt(params.id ?? "0");
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const utils = trpc.useUtils();

  const clientQuery = trpc.adminDashboard.getClientFull.useQuery(
    { clientId },
    { enabled: !!clientId }
  );

  const client = clientQuery.data as ClientFull | undefined;

  if (clientQuery.isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9f6f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#6b6b6b", fontSize: "0.875rem" }}>Loading client…</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9f6f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "1.25rem", color: "#1a1a1a", marginBottom: "1rem" }}>Client not found</div>
          <button onClick={() => navigate("/admin/clients")} style={btnPrimary}>← Back to Clients</button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "checklist", label: `Checklist (${client.checklist.length})` },
    { id: "documents", label: `Documents (${client.documents.length})` },
    { id: "appointments", label: `Appointments (${client.appointments.length})` },
    { id: "schools", label: `Schools (${client.schools.length})` },
    { id: "messages", label: `Messages (${client.messages.length})` },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f6f1" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#1a1a1a", padding: "1.5rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <button
            onClick={() => navigate("/admin/clients")}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", cursor: "pointer", letterSpacing: "0.1em" }}
          >
            ← All Clients
          </button>
        </div>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b49b6e", marginBottom: "0.25rem" }}>
          Client Profile
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 300, fontSize: "1.5rem", color: "#ffffff" }}>
          {client.profile.fullName}
        </h1>
        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "0.25rem" }}>
          {client.profile.email}
          {client.profile.servicePackage && ` · ${client.profile.servicePackage} package`}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid rgba(180,155,110,0.15)", padding: "0 2rem", display: "flex", gap: "0", overflowX: "auto" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "1rem 1.25rem",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #b49b6e" : "2px solid transparent",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: activeTab === tab.id ? "#b49b6e" : "#6b6b6b",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: "2rem" }}>
        {activeTab === "overview" && <OverviewTab client={client} utils={utils} />}
        {activeTab === "checklist" && <ChecklistTab clientId={clientId} items={client.checklist} utils={utils} />}
        {activeTab === "documents" && <DocumentsTab clientId={clientId} docs={client.documents} utils={utils} />}
        {activeTab === "appointments" && <AppointmentsTab clientId={clientId} appts={client.appointments} utils={utils} />}
        {activeTab === "schools" && <SchoolsTab clientId={clientId} schools={client.schools} utils={utils} />}
        {activeTab === "messages" && <MessagesTab clientId={clientId} messages={client.messages} utils={utils} />}
      </div>
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────

function OverviewTab({ client, utils }: { client: ClientFull; utils: ReturnType<typeof trpc.useUtils> }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: client.profile.fullName,
    phone: client.profile.phone ?? "",
    nationality: client.profile.nationality ?? "",
    currentCity: client.profile.currentCity ?? "",
    targetMoveDate: client.profile.targetMoveDate ?? "",
    servicePackage: client.profile.servicePackage as "standard" | "premium" | "elite",
    notes: client.profile.notes ?? "",
  });

  const updateMutation = trpc.adminDashboard.updateClient.useMutation({
    onSuccess: () => {
      utils.adminDashboard.getClientFull.invalidate({ clientId: client.profile.id });
      setEditing(false);
      toast.success("Profile updated");
    },
    onError: (err) => toast.error(err.message || "Update failed"),
  });

  if (!editing) {
    return (
      <div style={{ maxWidth: "600px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
          <button onClick={() => setEditing(true)} style={btnGold}>Edit Profile</button>
        </div>
        <div style={{ backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.12)", borderRadius: "2px", padding: "1.5rem" }}>
          {[
            ["Full Name", client.profile.fullName],
            ["Email", client.profile.email],
            ["Phone", client.profile.phone],
            ["Nationality", client.profile.nationality],
            ["Current City", client.profile.currentCity],
            ["Target Move Date", client.profile.targetMoveDate],
            ["Service Package", client.profile.servicePackage],
          ].map(([label, value]) => value ? (
            <div key={label as string} style={{ display: "flex", gap: "1rem", padding: "0.75rem 0", borderBottom: "1px solid rgba(180,155,110,0.08)" }}>
              <div style={{ width: "160px", flexShrink: 0, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9b9b9b" }}>{label}</div>
              <div style={{ fontSize: "0.875rem", color: "#1a1a1a" }}>{value}</div>
            </div>
          ) : null)}
          {client.profile.notes && (
            <div style={{ marginTop: "1rem" }}>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9b9b9b", marginBottom: "0.5rem" }}>Notes</div>
              <div style={{ fontSize: "0.875rem", color: "#1a1a1a", whiteSpace: "pre-wrap" }}>{client.profile.notes}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate({ id: client.profile.id, ...form }); }} style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {(["fullName", "phone", "nationality", "currentCity", "targetMoveDate"] as const).map((field) => (
          <div key={field}>
            <label style={labelStyle}>{field.replace(/([A-Z])/g, " $1").trim()}</label>
            <input type="text" value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
          </div>
        ))}
        <div>
          <label style={labelStyle}>Service Package</label>
          <select value={form.servicePackage} onChange={(e) => setForm((f) => ({ ...f, servicePackage: e.target.value as "standard" | "premium" | "elite" }))} style={inputStyle}>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="elite">Elite</option>
          </select>
        </div>
      </div>
      <div>
        <label style={labelStyle}>Notes</label>
        <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={4} style={{ ...inputStyle, resize: "vertical" }} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
      </div>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button type="submit" disabled={updateMutation.isPending} style={btnPrimary}>{updateMutation.isPending ? "Saving…" : "Save Changes"}</button>
        <button type="button" onClick={() => setEditing(false)} style={{ ...btnPrimary, backgroundColor: "transparent", color: "#6b6b6b", border: "1px solid rgba(180,155,110,0.3)" }}>Cancel</button>
      </div>
    </form>
  );
}

// ─── CHECKLIST TAB ────────────────────────────────────────────────────────────

function ChecklistTab({ clientId, items, utils }: { clientId: number; items: ChecklistItem[]; utils: ReturnType<typeof trpc.useUtils> }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", sortOrder: 0 });

  const addMutation = trpc.adminDashboard.addChecklistItem.useMutation({
    onSuccess: () => { utils.adminDashboard.getClientFull.invalidate({ clientId }); setShowForm(false); setForm({ title: "", description: "", category: "", sortOrder: 0 }); toast.success("Item added"); },
    onError: (err) => toast.error(err.message || "Failed to add item"),
  });

  const deleteMutation = trpc.adminDashboard.deleteChecklistItem.useMutation({
    onSuccess: () => { utils.adminDashboard.getClientFull.invalidate({ clientId }); toast.success("Item deleted"); },
    onError: (err) => toast.error(err.message || "Failed to delete item"),
  });

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
        <button onClick={() => setShowForm(!showForm)} style={btnGold}>+ Add Item</button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate({ clientProfileId: clientId, ...form }); }} style={{ marginBottom: "1.5rem", padding: "1.25rem", backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.2)", borderRadius: "2px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input type="text" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} placeholder="e.g. Housing" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
            </div>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "vertical" }} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" disabled={addMutation.isPending} style={btnPrimary}>{addMutation.isPending ? "Adding…" : "Add Item"}</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ ...btnPrimary, backgroundColor: "transparent", color: "#6b6b6b", border: "1px solid rgba(180,155,110,0.3)" }}>Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 && <div style={{ color: "#6b6b6b", fontSize: "0.875rem" }}>No checklist items yet.</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.12)", borderRadius: "2px" }}>
            <div style={{ width: "16px", height: "16px", borderRadius: "2px", border: "1px solid rgba(180,155,110,0.4)", backgroundColor: item.isCompleted ? "#b49b6e" : "transparent", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.875rem", color: "#1a1a1a", textDecoration: item.isCompleted ? "line-through" : "none" }}>{item.title}</div>
              {item.category && <div style={{ fontSize: "0.7rem", color: "#9b9b9b" }}>{item.category}</div>}
            </div>
            <button onClick={() => deleteMutation.mutate({ id: item.id })} style={btnDanger}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DOCUMENTS TAB ────────────────────────────────────────────────────────────

function DocumentsTab({ clientId, docs, utils }: { clientId: number; docs: Document[]; utils: ReturnType<typeof trpc.useUtils> }) {
  const [uploading, setUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const uploadMutation = trpc.adminDashboard.uploadDocument.useMutation({
    onSuccess: () => { utils.adminDashboard.getClientFull.invalidate({ clientId }); toast.success("Document uploaded"); },
    onError: (err) => toast.error(err.message || "Upload failed"),
  });

  const deleteMutation = trpc.adminDashboard.deleteDocument.useMutation({
    onSuccess: () => { utils.adminDashboard.getClientFull.invalidate({ clientId }); toast.success("Document deleted"); },
    onError: (err) => toast.error(err.message || "Delete failed"),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const mimeType = ALLOWED_MIME_TYPES[ext];
    if (!mimeType) { toast.error(`File type .${ext} not allowed`); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("File exceeds 10MB limit"); return; }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await uploadMutation.mutateAsync({ clientProfileId: clientId, fileName: file.name, mimeType, fileSize: file.size, base64Data: base64 });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDownload = async (docId: number) => {
    setDownloadingId(docId);
    try {
      // We need to call the query imperatively — use a helper
      const result = await utils.adminDashboard.getDocumentDownloadUrl.fetch({ documentId: docId });
      const a = document.createElement("a");
      a.href = result.url;
      a.download = result.fileName;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ ...btnGold, display: "inline-block", cursor: "pointer" }}>
          {uploading ? "Uploading…" : "+ Upload Document"}
          <input type="file" accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png" onChange={handleFileChange} style={{ display: "none" }} disabled={uploading} />
        </label>
        <span style={{ marginLeft: "1rem", fontSize: "0.75rem", color: "#9b9b9b" }}>PDF, DOCX, XLSX, JPG, PNG · Max 10MB</span>
      </div>

      {docs.length === 0 && <div style={{ color: "#6b6b6b", fontSize: "0.875rem" }}>No documents yet.</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {docs.map((doc) => (
          <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.12)", borderRadius: "2px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.875rem", color: "#1a1a1a" }}>{doc.originalName}</div>
              <div style={{ fontSize: "0.7rem", color: "#9b9b9b" }}>{formatSize(doc.fileSize)} · {new Date(doc.uploadedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
            </div>
            <button onClick={() => handleDownload(doc.id)} disabled={downloadingId === doc.id} style={{ ...btnGold, padding: "0.4rem 0.875rem" }}>{downloadingId === doc.id ? "…" : "Download"}</button>
            <button onClick={() => deleteMutation.mutate({ id: doc.id })} style={btnDanger}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APPOINTMENTS TAB ─────────────────────────────────────────────────────────

function AppointmentsTab({ clientId, appts, utils }: { clientId: number; appts: Appointment[]; utils: ReturnType<typeof trpc.useUtils> }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", appointmentDate: "", location: "", type: "meeting" as "call" | "viewing" | "meeting" | "school_visit" | "other" });

  const addMutation = trpc.adminDashboard.addAppointment.useMutation({
    onSuccess: () => { utils.adminDashboard.getClientFull.invalidate({ clientId }); setShowForm(false); setForm({ title: "", description: "", appointmentDate: "", location: "", type: "meeting" }); toast.success("Appointment added"); },
    onError: (err) => toast.error(err.message || "Failed to add appointment"),
  });

  const deleteMutation = trpc.adminDashboard.deleteAppointment.useMutation({
    onSuccess: () => { utils.adminDashboard.getClientFull.invalidate({ clientId }); toast.success("Appointment deleted"); },
    onError: (err) => toast.error(err.message || "Failed to delete"),
  });

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
        <button onClick={() => setShowForm(!showForm)} style={btnGold}>+ Add Appointment</button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); if (!form.appointmentDate) { toast.error("Date is required"); return; } addMutation.mutate({ clientProfileId: clientId, ...form, appointmentDate: new Date(form.appointmentDate) }); }} style={{ marginBottom: "1.5rem", padding: "1.25rem", backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.2)", borderRadius: "2px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input type="text" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>Date & Time *</label>
              <input type="datetime-local" required value={form.appointmentDate} onChange={(e) => setForm((f) => ({ ...f, appointmentDate: e.target.value }))} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as typeof form.type }))} style={inputStyle}>
                <option value="call">Phone Call</option>
                <option value="viewing">Property Viewing</option>
                <option value="meeting">Meeting</option>
                <option value="school_visit">School Visit</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "vertical" }} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" disabled={addMutation.isPending} style={btnPrimary}>{addMutation.isPending ? "Adding…" : "Add Appointment"}</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ ...btnPrimary, backgroundColor: "transparent", color: "#6b6b6b", border: "1px solid rgba(180,155,110,0.3)" }}>Cancel</button>
          </div>
        </form>
      )}

      {appts.length === 0 && <div style={{ color: "#6b6b6b", fontSize: "0.875rem" }}>No appointments yet.</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {appts.map((appt) => (
          <div key={appt.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.12)", borderRadius: "2px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.875rem", color: "#1a1a1a" }}>{appt.title}</div>
              <div style={{ fontSize: "0.7rem", color: "#9b9b9b" }}>{new Date(appt.appointmentDate).toLocaleString("en-GB")} · {appt.type} · {appt.status}</div>
              {appt.location && <div style={{ fontSize: "0.7rem", color: "#b49b6e" }}>📍 {appt.location}</div>}
            </div>
            <button onClick={() => deleteMutation.mutate({ id: appt.id })} style={btnDanger}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCHOOLS TAB ──────────────────────────────────────────────────────────────

function SchoolsTab({ clientId, schools, utils }: { clientId: number; schools: SchoolOption[]; utils: ReturnType<typeof trpc.useUtils> }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ schoolName: "", type: "international" as "international" | "bilingual" | "local" | "montessori" | "other", ageRange: "", curriculum: "", location: "", website: "", notes: "", status: "shortlisted" as "shortlisted" | "applied" | "accepted" | "rejected" | "waitlisted" });

  const addMutation = trpc.adminDashboard.addSchool.useMutation({
    onSuccess: () => { utils.adminDashboard.getClientFull.invalidate({ clientId }); setShowForm(false); setForm({ schoolName: "", type: "international", ageRange: "", curriculum: "", location: "", website: "", notes: "", status: "shortlisted" }); toast.success("School added"); },
    onError: (err) => toast.error(err.message || "Failed to add school"),
  });

  const deleteMutation = trpc.adminDashboard.deleteSchool.useMutation({
    onSuccess: () => { utils.adminDashboard.getClientFull.invalidate({ clientId }); toast.success("School deleted"); },
    onError: (err) => toast.error(err.message || "Failed to delete"),
  });

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
        <button onClick={() => setShowForm(!showForm)} style={btnGold}>+ Add School</button>
      </div>

      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate({ clientProfileId: clientId, ...form }); }} style={{ marginBottom: "1.5rem", padding: "1.25rem", backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.2)", borderRadius: "2px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <label style={labelStyle}>School Name *</label>
            <input type="text" required value={form.schoolName} onChange={(e) => setForm((f) => ({ ...f, schoolName: e.target.value }))} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={labelStyle}>Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as typeof form.type }))} style={inputStyle}>
                <option value="international">International</option>
                <option value="bilingual">Bilingual</option>
                <option value="local">Local</option>
                <option value="montessori">Montessori</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as typeof form.status }))} style={inputStyle}>
                <option value="shortlisted">Shortlisted</option>
                <option value="applied">Applied</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="waitlisted">Waitlisted</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Age Range</label>
              <input type="text" value={form.ageRange} onChange={(e) => setForm((f) => ({ ...f, ageRange: e.target.value }))} placeholder="e.g. 3–18" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
            </div>
            <div>
              <label style={labelStyle}>Curriculum</label>
              <input type="text" value={form.curriculum} onChange={(e) => setForm((f) => ({ ...f, curriculum: e.target.value }))} placeholder="e.g. IB, British" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
            </div>
            <div>
              <label style={labelStyle}>Website</label>
              <input type="url" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "vertical" }} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")} />
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" disabled={addMutation.isPending} style={btnPrimary}>{addMutation.isPending ? "Adding…" : "Add School"}</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ ...btnPrimary, backgroundColor: "transparent", color: "#6b6b6b", border: "1px solid rgba(180,155,110,0.3)" }}>Cancel</button>
          </div>
        </form>
      )}

      {schools.length === 0 && <div style={{ color: "#6b6b6b", fontSize: "0.875rem" }}>No school options yet.</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {schools.map((school) => (
          <div key={school.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.12)", borderRadius: "2px" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.875rem", color: "#1a1a1a" }}>{school.schoolName}</div>
              <div style={{ fontSize: "0.7rem", color: "#9b9b9b" }}>{school.type} · {school.status}{school.curriculum ? ` · ${school.curriculum}` : ""}</div>
              {school.location && <div style={{ fontSize: "0.7rem", color: "#b49b6e" }}>📍 {school.location}</div>}
            </div>
            <button onClick={() => deleteMutation.mutate({ id: school.id })} style={btnDanger}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MESSAGES TAB ─────────────────────────────────────────────────────────────

function MessagesTab({ clientId, messages, utils }: { clientId: number; messages: Message[]; utils: ReturnType<typeof trpc.useUtils> }) {
  const [message, setMessage] = useState("");

  const sendMutation = trpc.adminDashboard.sendMessageToClient.useMutation({
    onSuccess: () => { utils.adminDashboard.getClientFull.invalidate({ clientId }); setMessage(""); toast.success("Message sent"); },
    onError: (err) => toast.error(err.message || "Failed to send message"),
  });

  return (
    <div style={{ maxWidth: "700px" }}>
      {/* Message history */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem", maxHeight: "400px", overflowY: "auto", padding: "1rem", backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.12)", borderRadius: "2px" }}>
        {messages.length === 0 && <div style={{ color: "#6b6b6b", fontSize: "0.875rem", textAlign: "center" }}>No messages yet.</div>}
        {messages.map((msg) => {
          const isAdmin = msg.senderRole === "admin";
          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isAdmin ? "flex-end" : "flex-start" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9b9b9b", marginBottom: "0.2rem" }}>{isAdmin ? "You (Admin)" : "Client"}</div>
              <div style={{ maxWidth: "70%", padding: "0.75rem 1rem", backgroundColor: isAdmin ? "#1a1a1a" : "rgba(180,155,110,0.08)", borderRadius: "2px", fontSize: "0.875rem", color: isAdmin ? "#ffffff" : "#1a1a1a", whiteSpace: "pre-wrap" }}>
                {msg.content}
              </div>
              <div style={{ fontSize: "0.65rem", color: "#9b9b9b", marginTop: "0.2rem" }}>{new Date(msg.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          );
        })}
      </div>

      {/* Send form */}
      <form onSubmit={(e) => { e.preventDefault(); if (!message.trim()) return; sendMutation.mutate({ clientProfileId: clientId, content: message.trim() }); }} style={{ display: "flex", gap: "0.75rem" }}>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (message.trim()) sendMutation.mutate({ clientProfileId: clientId, content: message.trim() }); } }} placeholder="Type a message to the client…" rows={2} style={{ flex: 1, padding: "0.75rem 1rem", backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.25)", borderRadius: "2px", fontSize: "0.875rem", color: "#1a1a1a", resize: "none", outline: "none", fontFamily: "inherit" }} onFocus={(e) => (e.target.style.borderColor = "#b49b6e")} onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.25)")} />
        <button type="submit" disabled={sendMutation.isPending || !message.trim()} style={{ ...btnPrimary, alignSelf: "stretch", padding: "0 1.5rem" }}>{sendMutation.isPending ? "…" : "Send"}</button>
      </form>
    </div>
  );
}
