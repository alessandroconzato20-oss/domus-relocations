/**
 * DOMUS Relocations — Unified Admin Workspace
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft, ChevronUp, ChevronDown,
  CheckCircle, XCircle, Eye, Send, Sparkles, Plus, Trash2, Pencil,
  ClipboardList, Users, Building2, MessageSquare, FileText,
} from "lucide-react";
import type { ClientProfile, ChecklistItem, Document, Appointment, SchoolOption, Message } from "@shared/types";

function fmt(d: Date | string | null | undefined) {
  if (!d) return "n/a";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function StatusBadge({ active, label }: { active: boolean | number; label: string }) {
  const on = Boolean(active);
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 ${on ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-amber-700 bg-amber-50 border border-amber-200"}`}>
      {on ? <CheckCircle size={10} /> : <XCircle size={10} />}
      {label}
    </span>
  );
}
const card: React.CSSProperties = { background: "#fff", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 4, padding: "1.25rem" };
const TH: React.CSSProperties = { padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(45,41,38,0.5)", borderBottom: "1px solid rgba(45,41,38,0.08)", background: "#faf8f5" };
const TD: React.CSSProperties = { padding: "0.75rem 1rem", fontSize: "0.875rem", color: "var(--domus-charcoal)", borderBottom: "1px solid rgba(45,41,38,0.04)" };

type Submission = { id: number; primaryName: string; email: string; targetCity: string[] | null; arrivalDate: string | null; submittedAt: Date; advisorBriefSent: number; clientPreviewSent: number; clientPreviewPublished: number; assignedAdvisor: string | null; previewReadAt: Date | null; };

function IntakeDetail({ id, onBack }: { id: number; onBack: () => void }) {
  const { data: form, isLoading, refetch } = trpc.intake.getSubmission.useQuery({ id });
  const [notes, setNotes] = useState("");
  const [advisor, setAdvisor] = useState("");
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [previewText, setPreviewText] = useState("");
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [briefExpanded, setBriefExpanded] = useState(false);
  const resendBrief = trpc.intake.resendAdvisorBrief.useMutation({ onSuccess: () => { toast.success("Advisor Brief re-sent."); refetch(); }, onError: (e: { message: string }) => toast.error(e.message) });
  const regenerateAI = trpc.intake.regenerateAI.useMutation({ onSuccess: (d) => { toast.success("AI content regenerated."); setPreviewText(d.previewText); if (d.advisorBriefContent) setBriefExpanded(true); refetch(); }, onError: (e: { message: string }) => toast.error(e.message) });
  const publishPreview = trpc.intake.publishPreview.useMutation({ onSuccess: (d) => { toast.success(d.publishedToProfile ? "Published to client dashboard." : "Preview saved."); refetch(); }, onError: (e: { message: string }) => toast.error(e.message) });
  const updateNotes = trpc.intake.updateNotes.useMutation({ onSuccess: () => toast.success("Notes saved."), onError: (e: { message: string }) => toast.error(e.message) });
  const updateAdvisorMut = trpc.intake.updateNotes.useMutation({ onSuccess: () => toast.success("Advisor assigned."), onError: (e: { message: string }) => toast.error(e.message) });
  useEffect(() => { if (form && !notesLoaded) { setNotes(form.internalNotes ?? ""); setAdvisor(form.assignedAdvisor ?? ""); setNotesLoaded(true); } }, [form, notesLoaded]);
  useEffect(() => { if (form && !previewLoaded) { setPreviewText(form.clientPreviewContent ?? ""); setPreviewLoaded(true); } }, [form, previewLoaded]);
  if (isLoading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (!form) return <div style={{ padding: "2rem" }}>Not found.</div>;
  function Sec({ title, children }: { title: string; children: React.ReactNode }) {
    return <div style={{ ...card, marginBottom: "1rem" }}><p style={{ fontFamily: "'Jost',sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--domus-gold)", marginBottom: "1rem" }}>{title}</p>{children}</div>;
  }
  function F({ label, value }: { label: string; value: unknown }) {
    const v = Array.isArray(value) ? value.join(", ") : String(value ?? "");
    return <div style={{ marginBottom: "0.5rem" }}><span style={{ fontSize: "0.75rem", color: "rgba(45,41,38,0.5)", display: "block" }}>{label}</span><span style={{ fontSize: "0.875rem" }}>{v || "n/a"}</span></div>;
  }
  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "var(--domus-gold)", fontFamily: "'Jost',sans-serif", fontSize: "0.8rem", marginBottom: "1.5rem", padding: 0 }}>
        <ChevronLeft size={14} /> Back to list
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.8rem", fontWeight: 400, margin: 0 }}>{form.primaryName}</h2>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "rgba(45,41,38,0.6)" }}>{form.email} · Submitted {fmt(form.submittedAt)}</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <StatusBadge active={form.advisorBriefSent} label="Brief Sent" />
          <StatusBadge active={form.clientPreviewPublished} label="Preview Published" />
          {form.previewReadAt && <StatusBadge active={true} label="Client Read" />}
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <Button size="sm" variant="outline" onClick={() => resendBrief.mutate({ id })} disabled={resendBrief.isPending} className="flex items-center gap-1.5 text-xs">
          <Send size={12} />{resendBrief.isPending ? "Sending..." : "Re-send Advisor Brief"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => regenerateAI.mutate({ id })} disabled={regenerateAI.isPending} className="flex items-center gap-1.5 text-xs border-amber-600 text-amber-700 bg-amber-50">
          <Sparkles size={12} />{regenerateAI.isPending ? "Generating..." : "Regenerate AI Content"}
        </Button>
      </div>
      {form.advisorBriefContent && (
        <div style={{ ...card, marginBottom: "1rem", borderColor: "rgba(201,168,76,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: briefExpanded ? "1rem" : 0 }}>
            <p style={{ fontFamily: "'Jost',sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--domus-gold)", margin: 0 }}>Advisor Intelligence Brief</p>
            <button onClick={() => setBriefExpanded(!briefExpanded)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--domus-gold)" }}>
              {briefExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          {!briefExpanded && <p style={{ fontSize: "0.8rem", color: "rgba(45,41,38,0.5)", margin: "0.5rem 0 0" }}>{form.advisorBriefContent.substring(0, 200)}...</p>}
          {briefExpanded && <div style={{ background: "#faf8f5", padding: "1rem", borderRadius: 2, maxHeight: 400, overflowY: "auto", fontSize: "0.875rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{form.advisorBriefContent}</div>}
        </div>
      )}
      <div style={{ ...card, marginBottom: "1rem" }}>
        <p style={{ fontFamily: "'Jost',sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--domus-gold)", marginBottom: "1rem" }}>Client Preview</p>
        <Textarea value={previewText} onChange={(e) => setPreviewText(e.target.value)} rows={10} style={{ fontFamily: "monospace", fontSize: "0.8rem", marginBottom: "0.75rem" }} />
        <Button size="sm" onClick={() => publishPreview.mutate({ id, previewContent: previewText })} disabled={publishPreview.isPending} className="flex items-center gap-1.5 text-xs">
          <Eye size={12} />{publishPreview.isPending ? "Publishing..." : form.clientPreviewPublished ? "Update Published Preview" : "Publish to Client Dashboard"}
        </Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div style={card}>
          <p style={{ fontFamily: "'Jost',sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--domus-gold)", marginBottom: "0.75rem" }}>Internal Notes</p>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} style={{ marginBottom: "0.5rem", fontSize: "0.85rem" }} />
          <Button size="sm" variant="outline" onClick={() => updateNotes.mutate({ id, internalNotes: notes, assignedAdvisor: advisor })} disabled={updateNotes.isPending}>Save Notes</Button>
        </div>
        <div style={card}>
          <p style={{ fontFamily: "'Jost',sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--domus-gold)", marginBottom: "0.75rem" }}>Assigned Advisor</p>
          <Input value={advisor} onChange={(e) => setAdvisor(e.target.value)} placeholder="Advisor name" style={{ marginBottom: "0.5rem" }} />
          <Button size="sm" variant="outline" onClick={() => updateNotes.mutate({ id, internalNotes: notes, assignedAdvisor: advisor })} disabled={updateNotes.isPending}>Assign</Button>
        </div>
      </div>
      <Sec title="Section 1: The Family"><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "0.75rem" }}><F label="Primary Contact" value={form.primaryName} /><F label="Email" value={form.email} /><F label="Nationality" value={form.nationalities} /><F label="Family Size" value={form.whoRelocating} /><F label="Children" value={form.children} /><F label="Preferred Language" value={form.preferredLanguage} /></div></Sec>
      <Sec title="Section 2: The Move"><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "0.75rem" }}><F label="Origin City" value={form.fromCity} /><F label="Target City" value={form.targetCity} /><F label="Arrival Date" value={form.arrivalDate} /><F label="Move Reason" value={form.moveReasons} /><F label="Timeline Flexibility" value={form.dateFirmness} /></div></Sec>
      <Sec title="Section 3: Housing"><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "0.75rem" }}><F label="Property Type" value={form.propertyType} /><F label="Bedrooms" value={form.bedrooms} /><F label="Budget Range" value={form.budget} /><F label="Preferred Neighbourhoods" value={form.propertyRequirements} /><F label="Must Haves" value={form.propertyRequirements} /></div></Sec>
      <Sec title="Section 4: Education"><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "0.75rem" }}><F label="Curriculum Preference" value={form.curriculumPreference} /><F label="Mid-Year Entry" value={form.midYearEntry} /><F label="University Targets" value={form.universityTarget} /></div></Sec>
      <Sec title="Section 5: Professional and Fiscal"><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "0.75rem" }}><F label="Professional Situation" value={form.professionalSituation} /><F label="Partner Situation" value={form.partnerProfSituation} /><F label="Flat Tax Interest" value={form.flatTaxInterest} /><F label="Has Commercialista" value={form.hasCommercialista} /><F label="Banking Needs" value={form.bankingNeeds} /></div></Sec>
      <Sec title="Section 7: Priorities"><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "0.75rem" }}><F label="Top Priorities" value={form.topPriorities} /><F label="Biggest Anxiety" value={form.biggestAnxiety} /><F label="Heard About DOMUS" value={form.heardAboutDomus} /></div></Sec>
    </div>
  );
}

function IntakePanel({ jumpToId }: { jumpToId?: number | null }) {
  const [selectedId, setSelectedId] = useState<number | null>(jumpToId ?? null);
  useEffect(() => { if (jumpToId != null) setSelectedId(jumpToId); }, [jumpToId]);
  const { data: submissions = [], isLoading } = trpc.intake.listSubmissions.useQuery();
  if (selectedId !== null) return <IntakeDetail id={selectedId} onBack={() => setSelectedId(null)} />;
  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 400, marginBottom: "1.5rem" }}>Intake Forms</h2>
      {isLoading ? <p>Loading...</p> : submissions.length === 0 ? <p style={{ color: "rgba(45,41,38,0.5)" }}>No submissions yet.</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={TH}>Name</th><th style={TH}>Email</th><th style={TH}>Target City</th><th style={TH}>Submitted</th><th style={TH}>Brief</th><th style={TH}>Preview</th><th style={TH}>Preview Read</th><th style={TH}></th></tr></thead>
            <tbody>
              {submissions.map((s: Submission) => (
                <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => setSelectedId(s.id)} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#faf8f5"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                  <td style={TD}>{s.primaryName}</td>
                  <td style={{ ...TD, color: "rgba(45,41,38,0.6)" }}>{s.email}</td>
                  <td style={TD}>{Array.isArray(s.targetCity) ? s.targetCity.join(", ") : s.targetCity ?? "n/a"}</td>
                  <td style={{ ...TD, color: "rgba(45,41,38,0.6)" }}>{fmt(s.submittedAt)}</td>
                  <td style={TD}><StatusBadge active={s.advisorBriefSent} label="Brief" /></td>
                  <td style={TD}><StatusBadge active={s.clientPreviewPublished} label="Published" /></td>
                  <td style={{ ...TD, color: s.previewReadAt ? "#177245" : "rgba(45,41,38,0.55)" }}>{s.previewReadAt ? `Read ${fmt(s.previewReadAt)}` : "Not yet read"}</td>
                  <td style={{ ...TD, color: "var(--domus-gold)", fontWeight: 500 }}>View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

type ClientFull = { profile: ClientProfile; checklist: ChecklistItem[]; documents: Document[]; appointments: Appointment[]; schools: SchoolOption[]; messages: Message[] };

function ClientDetailPanel({ clientId, onBack, onViewIntake }: { clientId: number; onBack: () => void; onViewIntake: (id: number) => void }) {
  const { data, isLoading } = trpc.adminDashboard.getClientFull.useQuery({ clientId }, { enabled: !!clientId });
  const intakeQuery = trpc.intake.listSubmissions.useQuery();
  if (isLoading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (!data) return <div style={{ padding: "2rem" }}>Client not found.</div>;
  const { profile } = data as ClientFull;
  const linkedIntake = (intakeQuery.data ?? []).find((s: Submission) => s.email === profile?.email);
  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "var(--domus-gold)", fontFamily: "'Jost',sans-serif", fontSize: "0.8rem", marginBottom: "1.5rem", padding: 0 }}>
        <ChevronLeft size={14} /> Back to clients
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.8rem", fontWeight: 400, margin: 0 }}>{profile.fullName}</h2>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "rgba(45,41,38,0.6)" }}>{profile.email}</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {linkedIntake && (
            <button onClick={() => onViewIntake(linkedIntake.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.5rem 1rem", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 2, cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: "0.78rem", color: "var(--domus-gold)" }}>
              <FileText size={13} /> View Intake Form
            </button>
          )}
          <a href={`/admin/clients/${clientId}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.5rem 1rem", background: "rgba(45,41,38,0.06)", border: "1px solid rgba(45,41,38,0.15)", borderRadius: 2, fontFamily: "'Jost',sans-serif", fontSize: "0.78rem", color: "var(--domus-charcoal)", textDecoration: "none" }}>
            Full Client View
          </a>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "0.75rem" }}>
        {([["Full Name", profile.fullName], ["Email", profile.email], ["Phone", profile.phone], ["Nationality", profile.nationality], ["Current City", profile.currentCity], ["Target Move Date", fmt(profile.targetMoveDate)], ["Service Package", profile.servicePackage], ["Active", profile.isActive ? "Yes" : "No"]] as [string, unknown][]).map(([l, v]) => (
          <div key={l} style={{ ...card, padding: "1rem" }}><p style={{ fontSize: "0.7rem", color: "rgba(45,41,38,0.5)", margin: "0 0 0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</p><p style={{ margin: 0, fontSize: "0.875rem" }}>{String(v ?? "n/a")}</p></div>
        ))}
      </div>
    </div>
  );
}

function ClientsPanel({ onViewIntake }: { onViewIntake: (id: number) => void }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const clientsQuery = trpc.adminDashboard.listClients.useQuery();
  const clients = clientsQuery.data ?? [];
  if (selectedId !== null) return <ClientDetailPanel clientId={selectedId} onBack={() => setSelectedId(null)} onViewIntake={(id) => { setSelectedId(null); onViewIntake(id); }} />;
  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 400, marginBottom: "1.5rem" }}>Client Management</h2>
      {clientsQuery.isLoading ? <p>Loading...</p> : clients.length === 0 ? <p style={{ color: "rgba(45,41,38,0.5)" }}>No clients yet.</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={TH}>Name</th><th style={TH}>Email</th><th style={TH}>Package</th><th style={TH}>Status</th><th style={TH}>Move Date</th><th style={TH}></th></tr></thead>
            <tbody>
              {clients.map((c: ClientProfile) => (
                <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => setSelectedId(c.id)} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#faf8f5"} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ""}>
                  <td style={TD}>{c.fullName}</td>
                  <td style={{ ...TD, color: "rgba(45,41,38,0.6)" }}>{c.email}</td>
                  <td style={TD}><span style={{ textTransform: "capitalize" }}>{String(c.servicePackage ?? "standard")}</span></td>
                  <td style={TD}><span style={{ textTransform: "capitalize" }}>{c.isActive ? "active" : "inactive"}</span></td>
                  <td style={{ ...TD, color: "rgba(45,41,38,0.6)" }}>{fmt(c.targetMoveDate)}</td>
                  <td style={{ ...TD, color: "var(--domus-gold)", fontWeight: 500 }}>View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

type CorporateTab = "Leads" | "Access Codes" | "Accounts" | "City Cost Data";
type CostRow = { id: number; city: string; subArea: string | null; profileType: string; rentRangeMin: number; rentRangeMax: number; schoolFeeRangeMin: number | null; schoolFeeRangeMax: number | null; setupCostEstimate: number; healthcareCostEstimate: number; domusServiceFeeMin: number; domusServiceFeeMax: number; dataSource: string; dataQuality: string; lastUpdatedAt: Date };
const EMPTY_FORM = { city: "", subArea: "", profileType: "family_children" as "solo" | "couple" | "family_children", rentRangeMin: "", rentRangeMax: "", schoolFeeRangeMin: "", schoolFeeRangeMax: "", setupCostEstimate: "", healthcareCostEstimate: "", domusServiceFeeMin: "", domusServiceFeeMax: "", dataSource: "market_only" as "market_only" | "blended" | "domus_data", dataQuality: "full" as "full" | "limited" };

function MeridianPanel() {
  const [tab, setTab] = useState<CorporateTab>("Leads");
  const leadsQ = trpc.corporate.adminListLeads.useQuery();
  const codesQ = trpc.corporate.adminListCodes.useQuery();
  const accountsQ = trpc.corporate.adminListAccounts.useQuery();
  const costQ = trpc.corporate.adminListCostData.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CostRow | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const genCode = trpc.corporate.adminGenerateCode.useMutation({ onSuccess: () => { toast.success("Code generated."); codesQ.refetch(); }, onError: (e: { message: string }) => toast.error(e.message) });
  const upsertCost = trpc.corporate.adminUpsertCostData.useMutation({ onSuccess: () => { toast.success("Saved."); costQ.refetch(); setShowForm(false); setEditing(null); setForm({ ...EMPTY_FORM }); }, onError: (e: { message: string }) => toast.error(e.message) });
  const delCost = trpc.corporate.adminDeleteCostData.useMutation({ onSuccess: () => { toast.success("Deleted."); costQ.refetch(); }, onError: (e: { message: string }) => toast.error(e.message) });
  const updateLead = trpc.corporate.adminUpdateLeadStatus.useMutation({ onSuccess: () => leadsQ.refetch() });
  function openEdit(row: CostRow) { setEditing(row); setForm({ city: row.city, subArea: row.subArea ?? "", profileType: row.profileType as typeof EMPTY_FORM.profileType, rentRangeMin: String(row.rentRangeMin), rentRangeMax: String(row.rentRangeMax), schoolFeeRangeMin: String(row.schoolFeeRangeMin ?? ""), schoolFeeRangeMax: String(row.schoolFeeRangeMax ?? ""), setupCostEstimate: String(row.setupCostEstimate), healthcareCostEstimate: String(row.healthcareCostEstimate), domusServiceFeeMin: String(row.domusServiceFeeMin), domusServiceFeeMax: String(row.domusServiceFeeMax), dataSource: row.dataSource as typeof EMPTY_FORM.dataSource, dataQuality: row.dataQuality as typeof EMPTY_FORM.dataQuality }); setShowForm(true); }
  const tabs: CorporateTab[] = ["Leads", "Access Codes", "Accounts", "City Cost Data"];
  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 400, marginBottom: "1.5rem" }}>DOMUS Meridian</h2>
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(45,41,38,0.08)", marginBottom: "1.5rem", overflowX: "auto" }}>
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} style={{ padding: "0.75rem 1.25rem", background: "none", border: "none", borderBottom: tab === t ? "2px solid var(--domus-gold)" : "2px solid transparent", fontFamily: "'Jost',sans-serif", fontSize: "0.82rem", fontWeight: tab === t ? 600 : 400, color: tab === t ? "var(--domus-charcoal)" : "rgba(45,41,38,0.5)", cursor: "pointer", whiteSpace: "nowrap" }}>{t}</button>)}
      </div>
      {tab === "Leads" && (leadsQ.isLoading ? <p>Loading...</p> : (leadsQ.data ?? []).length === 0 ? <p style={{ color: "rgba(45,41,38,0.5)" }}>No leads yet.</p> : (
        <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><th style={TH}>Company</th><th style={TH}>Contact</th><th style={TH}>Email</th><th style={TH}>Status</th><th style={TH}>Date</th></tr></thead>
          <tbody>{(leadsQ.data ?? []).map((l: { id: number; companyName: string; contactName: string | null; workEmail: string; status: string; createdAt: Date }) => (
            <tr key={l.id}><td style={TD}>{l.companyName}</td><td style={TD}>{l.contactName ?? "n/a"}</td>
              <td style={TD}><a href={`mailto:${l.workEmail}`} style={{ color: "var(--domus-gold)", textDecoration: "none" }}>{l.workEmail}</a></td>
              <td style={TD}><select value={l.status} onChange={e => updateLead.mutate({ id: l.id, status: e.target.value as "pending" | "approved" | "rejected" })} style={{ fontSize: "0.8rem", border: "1px solid rgba(201,168,76,0.3)", background: "#faf8f5", padding: "0.25rem 0.5rem" }}>{["pending","approved","rejected"].map(s => <option key={s} value={s}>{s}</option>)}</select></td>
              <td style={{ ...TD, color: "rgba(45,41,38,0.6)" }}>{fmt(l.createdAt)}</td>
            </tr>
          ))}</tbody>
        </table></div>
      ))}
      {tab === "Access Codes" && (
        <div>
          <Button size="sm" onClick={() => { const company = prompt("Company name:"); if (company) genCode.mutate({ companyName: company }); }} disabled={genCode.isPending} className="mb-4 flex items-center gap-1.5 text-xs"><Plus size={12} />Generate Code</Button>
          {codesQ.isLoading ? <p>Loading...</p> : (codesQ.data ?? []).length === 0 ? <p style={{ color: "rgba(45,41,38,0.5)" }}>No codes yet.</p> : (
            <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={TH}>Code</th><th style={TH}>Company</th><th style={TH}>Used</th><th style={TH}>Status</th><th style={TH}>Created</th></tr></thead>
              <tbody>{(codesQ.data ?? []).map((c: { id: number; code: string; companyName: string; isActive: number; usedAt: Date | null; createdAt: Date }) => (
                <tr key={c.id}><td style={TD}><code style={{ background: "#faf8f5", padding: "0.2rem 0.4rem", fontSize: "0.85rem", letterSpacing: "0.1em" }}>{c.code}</code></td>
                  <td style={TD}>{c.companyName}</td><td style={TD}>{c.usedAt ? "Used" : "Unused"}</td>
                  <td style={TD}><StatusBadge active={c.isActive} label={c.isActive ? "Active" : "Inactive"} /></td>
                  <td style={{ ...TD, color: "rgba(45,41,38,0.6)" }}>{fmt(c.createdAt)}</td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </div>
      )}
      {tab === "Accounts" && (accountsQ.isLoading ? <p>Loading...</p> : (accountsQ.data ?? []).length === 0 ? <p style={{ color: "rgba(45,41,38,0.5)" }}>No accounts yet.</p> : (
        <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><th style={TH}>Company</th><th style={TH}>Status</th><th style={TH}>Activated</th></tr></thead>
          <tbody>{(accountsQ.data ?? []).map((a: { id: number; companyName: string; isActive: number; createdAt: Date }) => (
            <tr key={a.id}><td style={TD}>{a.companyName}</td><td style={TD}><StatusBadge active={a.isActive} label={a.isActive ? "Active" : "Inactive"} /></td><td style={{ ...TD, color: "rgba(45,41,38,0.6)" }}>{fmt(a.createdAt)}</td></tr>
          ))}</tbody>
        </table></div>
      ))}
      {tab === "City Cost Data" && (
        <div>
          <Button size="sm" onClick={() => { setEditing(null); setForm({ ...EMPTY_FORM }); setShowForm(true); }} className="mb-4 flex items-center gap-1.5 text-xs"><Plus size={12} />Add Row</Button>
          {showForm && (
            <div style={{ ...card, marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "'Jost',sans-serif", fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--domus-gold)", marginBottom: "1rem" }}>{editing ? "Edit Row" : "New Row"}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                {([["city","City *"],["subArea","Sub-Area"],["rentRangeMin","Rent Min (euro/mo)"],["rentRangeMax","Rent Max (euro/mo)"],["schoolFeeRangeMin","School Fees Min (euro/yr)"],["schoolFeeRangeMax","School Fees Max (euro/yr)"],["setupCostEstimate","Setup Costs (euro)"],["healthcareCostEstimate","Healthcare (euro/yr)"],["domusServiceFeeMin","DOMUS Fee Min (euro)"],["domusServiceFeeMax","DOMUS Fee Max (euro)"]] as [keyof typeof EMPTY_FORM, string][]).map(([k, label]) => (
                  <div key={k}><label style={{ fontSize: "0.72rem", color: "rgba(45,41,38,0.5)", display: "block", marginBottom: 2 }}>{label}</label><Input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} style={{ fontSize: "0.85rem" }} /></div>
                ))}
                <div><label style={{ fontSize: "0.72rem", color: "rgba(45,41,38,0.5)", display: "block", marginBottom: 2 }}>Profile Type</label><select value={form.profileType} onChange={e => setForm(f => ({ ...f, profileType: e.target.value as typeof EMPTY_FORM.profileType }))} style={{ width: "100%", padding: "0.5rem", border: "1px solid rgba(201,168,76,0.3)", background: "#faf8f5", fontSize: "0.85rem" }}><option value="solo">Solo</option><option value="couple">Couple</option><option value="family_children">Family with Children</option></select></div>
                <div><label style={{ fontSize: "0.72rem", color: "rgba(45,41,38,0.5)", display: "block", marginBottom: 2 }}>Data Quality</label><select value={form.dataQuality} onChange={e => setForm(f => ({ ...f, dataQuality: e.target.value as typeof EMPTY_FORM.dataQuality }))} style={{ width: "100%", padding: "0.5rem", border: "1px solid rgba(201,168,76,0.3)", background: "#faf8f5", fontSize: "0.85rem" }}><option value="full">Full</option><option value="limited">Limited</option></select></div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button size="sm" onClick={() => upsertCost.mutate({ id: editing?.id, city: form.city, subArea: form.subArea || undefined, profileType: form.profileType, rentRangeMin: Number(form.rentRangeMin) || 0, rentRangeMax: Number(form.rentRangeMax) || 0, schoolFeeRangeMin: form.schoolFeeRangeMin ? Number(form.schoolFeeRangeMin) : undefined, schoolFeeRangeMax: form.schoolFeeRangeMax ? Number(form.schoolFeeRangeMax) : undefined, setupCostEstimate: Number(form.setupCostEstimate) || 0, healthcareCostEstimate: Number(form.healthcareCostEstimate) || 0, domusServiceFeeMin: Number(form.domusServiceFeeMin) || 0, domusServiceFeeMax: Number(form.domusServiceFeeMax) || 0, dataSource: form.dataSource, dataQuality: form.dataQuality, lastUpdatedBy: "admin" })} disabled={upsertCost.isPending}>{upsertCost.isPending ? "Saving..." : "Save"}</Button>
                <Button size="sm" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Button>
              </div>
            </div>
          )}
          {costQ.isLoading ? <p>Loading...</p> : (costQ.data ?? []).length === 0 ? <p style={{ color: "rgba(45,41,38,0.5)" }}>No cost data yet.</p> : (
            <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={TH}>City</th><th style={TH}>Area</th><th style={TH}>Profile</th><th style={TH}>Rent</th><th style={TH}>School</th><th style={TH}>Quality</th><th style={TH}>Updated</th><th style={TH}></th></tr></thead>
              <tbody>{(costQ.data ?? []).map((r: CostRow) => (
                <tr key={r.id}><td style={TD}>{r.city}</td><td style={TD}>{r.subArea ?? "n/a"}</td><td style={TD}><span style={{ textTransform: "capitalize" }}>{r.profileType.replace(/_/g, " ")}</span></td>
                  <td style={TD}>{r.rentRangeMin} to {r.rentRangeMax}</td>
                  <td style={TD}>{r.schoolFeeRangeMin ?? "n/a"}{r.schoolFeeRangeMax ? ` to ${r.schoolFeeRangeMax}` : ""}</td>
                  <td style={TD}><span style={{ textTransform: "capitalize" }}>{r.dataQuality}</span></td>
                  <td style={{ ...TD, color: "rgba(45,41,38,0.6)" }}>{fmt(r.lastUpdatedAt)}</td>
                  <td style={TD}><div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => openEdit(r)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--domus-gold)" }}><Pencil size={13} /></button>
                    <button onClick={() => { if (confirm("Delete this row?")) delCost.mutate({ id: r.id }); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}><Trash2 size={13} /></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </div>
      )}
    </div>
  );
}

interface ContactSubmission { id: number; fullName: string; email: string; message: string; createdAt: Date; }
function ContactPanel() {
  const { data: submissions = [], isLoading } = trpc.submissions.getContactSubmissions.useQuery();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  return (
    <div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 400, marginBottom: "1.5rem" }}>Contact Inquiries</h2>
      {isLoading ? <p>Loading...</p> : submissions.length === 0 ? <p style={{ color: "rgba(45,41,38,0.5)" }}>No contact submissions yet.</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={TH}>Name</th><th style={TH}>Email</th><th style={TH}>Preview</th><th style={TH}>Date</th><th style={TH}></th></tr></thead>
            <tbody>
              {(submissions as ContactSubmission[]).map(s => (
                <tr key={s.id} style={{ borderBottom: "1px solid rgba(45,41,38,0.04)" }}>
                  <td style={TD}>{s.fullName}</td>
                  <td style={TD}><a href={`mailto:${s.email}`} style={{ color: "var(--domus-gold)", textDecoration: "none" }}>{s.email}</a></td>
                  <td style={{ ...TD, color: "rgba(45,41,38,0.6)" }}>{s.message.substring(0, 60)}{s.message.length > 60 ? "..." : ""}</td>
                  <td style={{ ...TD, color: "rgba(45,41,38,0.6)" }}>{fmt(s.createdAt)}</td>
                  <td style={TD}><button onClick={() => setExpandedId(expandedId === s.id ? null : s.id)} style={{ padding: "0.4rem 0.75rem", background: "var(--domus-gold)", color: "white", border: "none", fontSize: "0.78rem", cursor: "pointer" }}>{expandedId === s.id ? "Hide" : "View"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {expandedId !== null && (() => { const s = (submissions as ContactSubmission[]).find(x => x.id === expandedId); return s ? <div style={{ marginTop: "1.5rem", ...card }}><p style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Full message from {s.fullName}</p><p style={{ background: "#faf8f5", padding: "1rem", fontSize: "0.875rem", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{s.message}</p></div> : null; })()}
        </div>
      )}
    </div>
  );
}

type Section = "intake" | "clients" | "meridian" | "contact";
export default function AdminWorkspace() {
  const [, navigate] = useLocation();
  const meQuery = trpc.auth.me.useQuery();
  const [section, setSection] = useState<Section>("intake");
  const [intakeJumpId, setIntakeJumpId] = useState<number | null>(null);
  useEffect(() => { if (meQuery.data && meQuery.data.role !== "admin") navigate("/"); }, [meQuery.data, navigate]);
  if (meQuery.isLoading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'Jost',sans-serif" }}>Loading...</div>;
  const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: "intake", label: "Intake Forms", icon: <ClipboardList size={16} /> },
    { id: "clients", label: "Clients", icon: <Users size={16} /> },
    { id: "meridian", label: "DOMUS Meridian", icon: <Building2 size={16} /> },
    { id: "contact", label: "Contact Inquiries", icon: <MessageSquare size={16} /> },
  ];
  function handleViewIntake(id: number) { setIntakeJumpId(id); setSection("intake"); }
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f4ef", fontFamily: "'Jost',sans-serif" }}>
      <aside style={{ width: 220, flexShrink: 0, background: "#1a1814", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "1.5rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", fontWeight: 400, color: "#f5f0e8", margin: 0, letterSpacing: "0.05em" }}>DOMUS</p>
            <p style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,240,232,0.4)", margin: "0.15rem 0 0" }}>Admin Workspace</p>
          </a>
        </div>
        <nav style={{ padding: "1rem 0", flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setSection(item.id); if (item.id !== "intake") setIntakeJumpId(null); }} style={{ display: "flex", alignItems: "center", gap: "0.625rem", width: "100%", padding: "0.75rem 1.25rem", background: section === item.id ? "rgba(201,168,76,0.12)" : "none", border: "none", borderLeft: section === item.id ? "2px solid var(--domus-gold)" : "2px solid transparent", color: section === item.id ? "#f5f0e8" : "rgba(245,240,232,0.45)", fontFamily: "'Jost',sans-serif", fontSize: "0.82rem", fontWeight: section === item.id ? 500 : 400, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <a href="/" style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.3)", textDecoration: "none" }}>Back to site</a>
        </div>
      </aside>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto", minWidth: 0 }}>
        {section === "intake" && <IntakePanel jumpToId={intakeJumpId} />}
        {section === "clients" && <ClientsPanel onViewIntake={handleViewIntake} />}
        {section === "meridian" && <MeridianPanel />}
        {section === "contact" && <ContactPanel />}
      </main>
    </div>
  );
}
