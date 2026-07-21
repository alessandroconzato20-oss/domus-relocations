/**
 * DOMUS Meridian — Admin Corporate Panel
 * Tabs: Leads | Access Codes | Accounts | City Cost Data
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Plus, Trash2, Pencil, Check, X, Copy } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function Badge({ label, variant }: { label: string; variant: "gold" | "green" | "red" | "neutral" }) {
  const styles = {
    gold: "text-[#B8963E] bg-[#FAF6EE] border border-[#D4AF6A]",
    green: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    red: "text-red-700 bg-red-50 border border-red-200",
    neutral: "text-stone-600 bg-stone-50 border border-stone-200",
  };
  return <span className={`inline-flex items-center text-xs px-2 py-0.5 ${styles[variant]}`}>{label}</span>;
}

// ─── Leads Tab ────────────────────────────────────────────────────────────────
function LeadsTab() {
  const { data: leads, isLoading, refetch } = trpc.corporate.adminListLeads.useQuery();
  const updateStatus = trpc.corporate.adminUpdateLeadStatus.useMutation({
    onSuccess: () => { refetch(); toast.success("Status updated."); },
  });

  if (isLoading) return <p className="text-stone-400 text-sm py-8 text-center">Loading…</p>;

  return (
    <div>
      <p className="text-stone-500 text-sm mb-6">Corporate enquiries submitted via the /corporate landing page.</p>
      {!leads?.length ? (
        <p className="text-stone-400 text-sm py-12 text-center italic">No leads yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8DFD0] text-left">
                {["Company", "Contact", "Work Email", "Relocations/yr", "Date", "Status", "Actions"].map(h => (
                  <th key={h} className="pb-3 pr-4 text-xs uppercase tracking-widest text-stone-400 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id} className="border-b border-[#F0EBE3] hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 pr-4 font-medium text-stone-800">{l.companyName}</td>
                  <td className="py-3 pr-4 text-stone-600">{l.contactName || "—"}</td>
                  <td className="py-3 pr-4 text-stone-600">{l.workEmail}</td>
                  <td className="py-3 pr-4 text-stone-600">{l.relocationsPerYear}</td>
                  <td className="py-3 pr-4 text-stone-500">{formatDate(l.createdAt)}</td>
                  <td className="py-3 pr-4">
                    <Badge
                      label={l.status}
                      variant={l.status === "approved" ? "green" : l.status === "rejected" ? "red" : "gold"}
                    />
                  </td>
                  <td className="py-3 flex gap-2">
                    {l.status !== "approved" && (
                      <Button size="sm" variant="outline" className="text-xs h-7 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        onClick={() => updateStatus.mutate({ id: l.id, status: "approved" })}>
                        Approve
                      </Button>
                    )}
                    {l.status !== "rejected" && (
                      <Button size="sm" variant="outline" className="text-xs h-7 border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => updateStatus.mutate({ id: l.id, status: "rejected" })}>
                        Reject
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Access Codes Tab ─────────────────────────────────────────────────────────
function AccessCodesTab() {
  const { data: codes, isLoading, refetch } = trpc.corporate.adminListCodes.useQuery();
  const generateCode = trpc.corporate.adminGenerateCode.useMutation({
    onSuccess: (data) => { refetch(); toast.success(`Code generated: ${data.code}`); setCompanyInput(""); },
    onError: (e) => toast.error(e.message),
  });
  const [companyInput, setCompanyInput] = useState("");

  if (isLoading) return <p className="text-stone-400 text-sm py-8 text-center">Loading…</p>;

  return (
    <div>
      <p className="text-stone-500 text-sm mb-6">Generate single-use 6-character access codes for HR teams to activate their DOMUS Meridian account.</p>

      {/* Generate form */}
      <div className="flex gap-3 mb-8 max-w-md">
        <Input
          placeholder="Company name"
          value={companyInput}
          onChange={e => setCompanyInput(e.target.value)}
          className="border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm"
        />
        <Button
          onClick={() => { if (companyInput.trim()) generateCode.mutate({ companyName: companyInput.trim() }); }}
          disabled={!companyInput.trim() || generateCode.isPending}
          className="bg-[#B8963E] hover:bg-[#9A7D33] text-white text-xs px-4 whitespace-nowrap"
        >
          <Plus size={14} className="mr-1" /> Generate Code
        </Button>
      </div>

      {!codes?.length ? (
        <p className="text-stone-400 text-sm py-12 text-center italic">No codes generated yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8DFD0] text-left">
                {["Code", "Company", "Created", "Used", "Status"].map(h => (
                  <th key={h} className="pb-3 pr-4 text-xs uppercase tracking-widest text-stone-400 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {codes.map(c => (
                <tr key={c.id} className="border-b border-[#F0EBE3] hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-[#B8963E] font-semibold tracking-widest text-base">{c.code}</code>
                      <button
                        onClick={() => { navigator.clipboard.writeText(c.code); toast.success("Copied!"); }}
                        className="text-stone-400 hover:text-stone-600 transition-colors"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-stone-700">{c.companyName}</td>
                  <td className="py-3 pr-4 text-stone-500">{formatDate(c.createdAt)}</td>
                  <td className="py-3 pr-4 text-stone-500">{c.usedAt ? formatDate(c.usedAt) : "—"}</td>
                  <td className="py-3 pr-4">
                    <Badge
                      label={c.usedAt ? "Used" : c.isActive ? "Active" : "Inactive"}
                      variant={c.usedAt ? "neutral" : c.isActive ? "green" : "red"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Accounts Tab ─────────────────────────────────────────────────────────────
function AccountsTab() {
  const { data: accounts, isLoading } = trpc.corporate.adminListAccounts.useQuery();

  if (isLoading) return <p className="text-stone-400 text-sm py-8 text-center">Loading…</p>;

  return (
    <div>
      <p className="text-stone-500 text-sm mb-6">Active DOMUS Meridian corporate accounts.</p>
      {!accounts?.length ? (
        <p className="text-stone-400 text-sm py-12 text-center italic">No accounts activated yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8DFD0] text-left">
                {["Company", "Activated", "Status"].map(h => (
                  <th key={h} className="pb-3 pr-4 text-xs uppercase tracking-widest text-stone-400 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.map(a => (
                <tr key={a.id} className="border-b border-[#F0EBE3] hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 pr-4 font-medium text-stone-800">{a.companyName}</td>
                  <td className="py-3 pr-4 text-stone-500">{formatDate(a.createdAt)}</td>
                  <td className="py-3 pr-4">
                    <Badge label={a.isActive ? "Active" : "Inactive"} variant={a.isActive ? "green" : "red"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── City Cost Data Tab ───────────────────────────────────────────────────────
type CostRow = {
  id: number;
  city: string;
  subArea: string | null;
  profileType: "solo" | "couple" | "family_children";
  rentRangeMin: number;
  rentRangeMax: number;
  schoolFeeRangeMin: number | null;
  schoolFeeRangeMax: number | null;
  setupCostEstimate: number;
  healthcareCostEstimate: number;
  domusServiceFeeMin: number;
  domusServiceFeeMax: number;
  dataSource: "market_only" | "blended" | "domus_data";
  dataQuality: "full" | "limited";
  lastUpdatedBy: string;
  lastUpdatedAt: Date;
  createdAt: Date;
};

const EMPTY_FORM = {
  city: "",
  subArea: "",
  profileType: "solo" as "solo" | "couple" | "family_children",
  rentRangeMin: 0,
  rentRangeMax: 0,
  schoolFeeRangeMin: undefined as number | undefined,
  schoolFeeRangeMax: undefined as number | undefined,
  setupCostEstimate: 0,
  healthcareCostEstimate: 0,
  domusServiceFeeMin: 0,
  domusServiceFeeMax: 0,
  dataSource: "market_only" as "market_only" | "blended" | "domus_data",
  dataQuality: "full" as "full" | "limited",
  lastUpdatedBy: "",
};

function CostDataTab() {
  const { data: rows, isLoading, refetch } = trpc.corporate.adminListCostData.useQuery();
  const upsert = trpc.corporate.adminUpsertCostData.useMutation({
    onSuccess: () => { refetch(); setEditing(null); setShowForm(false); toast.success("Saved."); },
    onError: (e) => toast.error(e.message),
  });
  const del = trpc.corporate.adminDeleteCostData.useMutation({
    onSuccess: () => { refetch(); toast.success("Deleted."); },
    onError: (e) => toast.error(e.message),
  });

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CostRow | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
  }

  function openEdit(row: CostRow) {
    setEditing(row);
    setForm({
      city: row.city,
      subArea: row.subArea ?? "",
      profileType: row.profileType as "solo" | "couple" | "family_children",
      rentRangeMin: row.rentRangeMin,
      rentRangeMax: row.rentRangeMax,
      schoolFeeRangeMin: row.schoolFeeRangeMin ?? undefined,
      schoolFeeRangeMax: row.schoolFeeRangeMax ?? undefined,
      setupCostEstimate: row.setupCostEstimate,
      healthcareCostEstimate: row.healthcareCostEstimate,
      domusServiceFeeMin: row.domusServiceFeeMin,
      domusServiceFeeMax: row.domusServiceFeeMax,
      dataSource: row.dataSource as "market_only" | "blended" | "domus_data",
      dataQuality: row.dataQuality as "full" | "limited",
      lastUpdatedBy: row.lastUpdatedBy,
    });
    setShowForm(true);
  }

  function handleSave() {
    upsert.mutate({
      id: editing?.id,
      ...form,
      subArea: form.subArea || undefined,
    });
  }

  const F = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1">{label}</label>
      {children}
    </div>
  );

  const numInput = (key: keyof typeof form, placeholder?: string) => (
    <Input
      type="number"
      placeholder={placeholder ?? "0"}
      value={(form[key] as number | undefined) ?? ""}
      onChange={e => setForm(f => ({ ...f, [key]: e.target.value === "" ? undefined : Number(e.target.value) }))}
      className="border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm h-9"
    />
  );

  if (isLoading) return <p className="text-stone-400 text-sm py-8 text-center">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-stone-500 text-sm">Reference cost data used by the corporate relocation cost estimator. Keep this updated to ensure accurate estimates.</p>
        <Button onClick={openNew} className="bg-[#B8963E] hover:bg-[#9A7D33] text-white text-xs px-4 ml-4 whitespace-nowrap">
          <Plus size={14} className="mr-1" /> Add Row
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="border border-[#D4C5B0] bg-[#FAF8F5] p-6 mb-8">
          <h3 className="font-cormorant text-lg text-stone-800 mb-5">{editing ? "Edit Cost Row" : "New Cost Row"}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <F label="City">
              <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm h-9" placeholder="e.g. Milan" />
            </F>
            <F label="Sub-area (optional)">
              <Input value={form.subArea} onChange={e => setForm(f => ({ ...f, subArea: e.target.value }))}
                className="border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm h-9" placeholder="e.g. Brera" />
            </F>
            <F label="Profile Type">
              <select value={form.profileType} onChange={e => setForm(f => ({ ...f, profileType: e.target.value as any }))}
                className="w-full border border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm h-9 px-2 rounded-none">
                <option value="solo">Solo</option>
                <option value="couple">Couple</option>
                <option value="family_children">Family with children</option>
              </select>
            </F>
            <F label="Data Quality">
              <select value={form.dataQuality} onChange={e => setForm(f => ({ ...f, dataQuality: e.target.value as any }))}
                className="w-full border border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm h-9 px-2 rounded-none">
                <option value="full">Full data</option>
                <option value="limited">Limited data</option>
              </select>
            </F>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <F label="Rent Min (€/mo)">{numInput("rentRangeMin")}</F>
            <F label="Rent Max (€/mo)">{numInput("rentRangeMax")}</F>
            <F label="School Fee Min (€/yr)">{numInput("schoolFeeRangeMin", "N/A")}</F>
            <F label="School Fee Max (€/yr)">{numInput("schoolFeeRangeMax", "N/A")}</F>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <F label="Setup Cost (€)">{numInput("setupCostEstimate")}</F>
            <F label="Healthcare (€/yr)">{numInput("healthcareCostEstimate")}</F>
            <F label="DOMUS Fee Min (€)">{numInput("domusServiceFeeMin")}</F>
            <F label="DOMUS Fee Max (€)">{numInput("domusServiceFeeMax")}</F>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <F label="Data Source">
              <select value={form.dataSource} onChange={e => setForm(f => ({ ...f, dataSource: e.target.value as any }))}
                className="w-full border border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm h-9 px-2 rounded-none">
                <option value="market_only">Market only</option>
                <option value="blended">Blended</option>
                <option value="domus_data">DOMUS data</option>
              </select>
            </F>
            <F label="Updated by">
              <Input value={form.lastUpdatedBy} onChange={e => setForm(f => ({ ...f, lastUpdatedBy: e.target.value }))}
                className="border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm h-9" placeholder="Your name" />
            </F>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={upsert.isPending}
              className="bg-[#B8963E] hover:bg-[#9A7D33] text-white text-xs px-5">
              <Check size={14} className="mr-1" /> {upsert.isPending ? "Saving…" : "Save Row"}
            </Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}
              className="text-xs border-stone-300 text-stone-600">
              <X size={14} className="mr-1" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {!rows?.length ? (
        <p className="text-stone-400 text-sm py-12 text-center italic">No cost data yet. Add the first row above.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8DFD0] text-left">
                {["City", "Sub-area", "Profile", "Rent (€/mo)", "School (€/yr)", "Setup (€)", "DOMUS Fee (€)", "Quality", "Updated", ""].map(h => (
                  <th key={h} className="pb-3 pr-3 text-xs uppercase tracking-widest text-stone-400 font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(rows as CostRow[]).map(r => (
                <tr key={r.id} className="border-b border-[#F0EBE3] hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3 pr-3 font-medium text-stone-800">{r.city}</td>
                  <td className="py-3 pr-3 text-stone-500">{r.subArea || "—"}</td>
                  <td className="py-3 pr-3">
                    <Badge
                      label={{ solo: "Solo", couple: "Couple", family_children: "Family" }[r.profileType]}
                      variant="neutral"
                    />
                  </td>
                  <td className="py-3 pr-3 text-stone-700">{r.rentRangeMin.toLocaleString()} – {r.rentRangeMax.toLocaleString()}</td>
                  <td className="py-3 pr-3 text-stone-700">
                    {r.schoolFeeRangeMin ? `${r.schoolFeeRangeMin.toLocaleString()} – ${r.schoolFeeRangeMax?.toLocaleString()}` : "—"}
                  </td>
                  <td className="py-3 pr-3 text-stone-700">{r.setupCostEstimate.toLocaleString()}</td>
                  <td className="py-3 pr-3 text-stone-700">{r.domusServiceFeeMin.toLocaleString()} – {r.domusServiceFeeMax.toLocaleString()}</td>
                  <td className="py-3 pr-3">
                    <Badge label={r.dataQuality === "full" ? "Full" : "Limited"} variant={r.dataQuality === "full" ? "green" : "gold"} />
                  </td>
                  <td className="py-3 pr-3 text-stone-400 text-xs">{formatDate(r.lastUpdatedAt)}</td>
                  <td className="py-3 flex gap-2">
                    <button onClick={() => openEdit(r)} className="text-stone-400 hover:text-[#B8963E] transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => { if (confirm("Delete this row?")) del.mutate({ id: r.id }); }}
                      className="text-stone-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS = ["Leads", "Access Codes", "Accounts", "City Cost Data"] as const;
type Tab = typeof TABS[number];

export default function CorporateAdmin() {
  const [tab, setTab] = useState<Tab>("Leads");

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="border-b border-[#E8DFD0] bg-white px-8 py-5 flex items-center gap-4">
        <Link href="/admin">
          <button className="text-stone-400 hover:text-stone-700 transition-colors">
            <ChevronLeft size={18} />
          </button>
        </Link>
        <div>
          <h1 className="font-cormorant text-2xl text-stone-800 tracking-wide">DOMUS Meridian</h1>
          <p className="text-xs text-stone-400 tracking-widest uppercase mt-0.5">Corporate HR Platform — Admin</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E8DFD0] bg-white px-8">
        <div className="flex gap-0">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-xs uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "border-[#B8963E] text-[#B8963E]"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 max-w-7xl">
        {tab === "Leads" && <LeadsTab />}
        {tab === "Access Codes" && <AccessCodesTab />}
        {tab === "Accounts" && <AccountsTab />}
        {tab === "City Cost Data" && <CostDataTab />}
      </div>
    </div>
  );
}
