/*
 * DOMUS Relocations — Admin Intake Forms
 * Lists all private client intake submissions with detail view and re-send actions.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Mail, RefreshCw, FileText, User, MapPin, Calendar, CheckCircle, XCircle } from "lucide-react";

const ADMIN_EMAIL = "milano@domusrelocations.com";

// ─── Types ────────────────────────────────────────────────────────────────────
type Submission = {
  id: number;
  primaryName: string;
  email: string;
  targetCity: string[] | null;
  arrivalDate: string | null;
  submittedAt: Date;
  advisorBriefSent: number;
  clientPreviewSent: number;
  assignedAdvisor: string | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ sent, label }: { sent: number; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 ${
      sent ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-amber-700 bg-amber-50 border border-amber-200"
    }`}>
      {sent ? <CheckCircle size={10} /> : <XCircle size={10} />}
      {label}
    </span>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────
function DetailView({ id, onBack }: { id: number; onBack: () => void }) {
  const { data: form, isLoading, refetch } = trpc.intake.getSubmission.useQuery({ id });
  const [notes, setNotes] = useState<string>("");
  const [advisor, setAdvisor] = useState<string>("");
  const [notesLoaded, setNotesLoaded] = useState(false);

  const resendBriefMutation = trpc.intake.resendAdvisorBrief.useMutation({
    onSuccess: () => { toast.success("Advisor Brief is being regenerated and sent."); refetch(); },
    onError: (e) => toast.error(e.message),
  });
  const resendPreviewMutation = trpc.intake.resendClientPreview.useMutation({
    onSuccess: () => { toast.success("Client Preview is being regenerated and sent."); refetch(); },
    onError: (e) => toast.error(e.message),
  });
  const updateNotesMutation = trpc.intake.updateNotes.useMutation({
    onSuccess: () => toast.success("Notes saved."),
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[var(--domus-gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!form) return <p className="text-[var(--domus-grey)]">Submission not found.</p>;

  // Initialise notes from DB on first load
  if (!notesLoaded && form.internalNotes !== undefined) {
    setNotes(form.internalNotes || "");
    setAdvisor(form.assignedAdvisor || "");
    setNotesLoaded(true);
  }

  const children = (form.children as Array<{ name: string; dateOfBirth: string; currentSchool: string; currentCurriculum: string; yearGrade: string; languagesSpoken: string }> | null) || [];

  function Field({ label, value }: { label: string; value: unknown }) {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    const display = Array.isArray(value) ? (value as string[]).join(", ") : String(value);
    return (
      <div className="space-y-0.5">
        <p className="text-xs tracking-widest uppercase text-[var(--domus-grey)]">{label}</p>
        <p className="text-sm text-[var(--domus-charcoal)]">{display}</p>
      </div>
    );
  }

  function Section({ title, children: ch }: { title: string; children: React.ReactNode }) {
    return (
      <div className="space-y-4">
        <p className="text-xs tracking-widest uppercase text-[var(--domus-gold)] border-b border-[var(--domus-gold)]/20 pb-2">{title}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{ch}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[var(--domus-grey)] hover:text-[var(--domus-charcoal)] mb-3 transition-colors">
            <ChevronLeft size={14} /> Back to submissions
          </button>
          <h1 className="font-['Cormorant_Garamond'] text-3xl text-[var(--domus-charcoal)] font-light">{form.primaryName}</h1>
          <p className="text-sm text-[var(--domus-grey)] mt-1">{form.email} · Submitted {formatDate(form.submittedAt)}</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-2">
            <StatusBadge sent={form.advisorBriefSent} label="Advisor Brief" />
            <StatusBadge sent={form.clientPreviewSent} label="Client Preview" />
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => resendBriefMutation.mutate({ id })}
              disabled={resendBriefMutation.isPending}
              className="flex items-center gap-1.5 text-xs border-[var(--domus-charcoal)] text-[var(--domus-charcoal)]"
            >
              <RefreshCw size={12} />
              {resendBriefMutation.isPending ? "Sending…" : "Re-send Advisor Brief"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => resendPreviewMutation.mutate({ id })}
              disabled={resendPreviewMutation.isPending}
              className="flex items-center gap-1.5 text-xs border-[var(--domus-gold)] text-[var(--domus-gold)]"
            >
              <Mail size={12} />
              {resendPreviewMutation.isPending ? "Sending…" : "Re-send Client Preview"}
            </Button>
          </div>
        </div>
      </div>

      {/* Internal notes */}
      <div className="border border-[var(--domus-gold)]/20 p-5 space-y-4 bg-[var(--domus-gold)]/3">
        <p className="text-xs tracking-widest uppercase text-[var(--domus-gold)]">Internal Notes</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this family…"
              rows={3}
              className="text-sm resize-none border-[var(--domus-grey)]/40 bg-transparent rounded-none"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs tracking-widest uppercase text-[var(--domus-grey)]">Assigned Advisor</p>
            <Input
              value={advisor}
              onChange={(e) => setAdvisor(e.target.value)}
              placeholder="Advisor name"
              className="text-sm border-[var(--domus-grey)]/40 bg-transparent rounded-none"
            />
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => updateNotesMutation.mutate({ id, internalNotes: notes, assignedAdvisor: advisor })}
          disabled={updateNotesMutation.isPending}
          className="bg-[var(--domus-charcoal)] text-[var(--domus-ivory)] hover:bg-[var(--domus-gold)] hover:text-[var(--domus-charcoal)] text-xs"
        >
          {updateNotesMutation.isPending ? "Saving…" : "Save Notes"}
        </Button>
      </div>

      {/* Form data */}
      <Section title="Section 1 — The Family">
        <Field label="Primary Name" value={form.primaryName} />
        <Field label="Email" value={form.email} />
        <Field label="Phone" value={form.phone} />
        <Field label="Preferred Language" value={form.preferredLanguage} />
        <Field label="Who is Relocating" value={form.whoRelocating} />
        <Field label="Partner Name" value={form.partnerName} />
        <Field label="Partner Nationality" value={form.partnerNationality} />
        <Field label="Partner Languages" value={form.partnerLanguages} />
        <Field label="Pets" value={form.pets} />
      </Section>

      {children.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs tracking-widest uppercase text-[var(--domus-gold)] border-b border-[var(--domus-gold)]/20 pb-2">Children</p>
          {children.map((child, i) => (
            <div key={i} className="border border-[var(--domus-gold)]/15 p-4">
              <p className="text-xs tracking-widest uppercase text-[var(--domus-grey)] mb-3">Child {i + 1} — {child.name}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Field label="Date of Birth" value={child.dateOfBirth} />
                <Field label="Current School" value={child.currentSchool} />
                <Field label="Curriculum" value={child.currentCurriculum} />
                <Field label="Year / Grade" value={child.yearGrade} />
                <Field label="Languages" value={child.languagesSpoken} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Section title="Section 2 — The Move">
        <Field label="From" value={form.fromCity} />
        <Field label="Nationalities" value={form.nationalities} />
        <Field label="Move Reasons" value={form.moveReasons} />
        <Field label="Target Arrival" value={form.arrivalDate} />
        <Field label="Date Firmness" value={form.dateFirmness} />
        <Field label="Intended Duration" value={form.intendedDuration} />
        <Field label="Target City" value={form.targetCity} />
        <Field label="Lived in Italy Before" value={form.livedInItalyBefore} />
        <Field label="Previous Countries" value={form.previousCountries} />
      </Section>

      <Section title="Section 3 — Housing">
        <Field label="Rent or Buy" value={form.rentOrBuy} />
        <Field label="Budget" value={form.budget} />
        <Field label="Bedrooms" value={form.bedrooms} />
        <Field label="Property Type" value={form.propertyType} />
        <Field label="Requirements" value={form.propertyRequirements} />
        <Field label="Neighbourhood Vibe" value={form.neighbourhoodVibe} />
        <Field label="Neighbourhoods Researched" value={form.neighbourhoodInterest} />
        <Field label="Previous Home Notes" value={form.previousHomeNotes} />
      </Section>

      <Section title="Section 4 — Education">
        <Field label="Italian Immersion Scale" value={form.italianImmersionScale ? `${form.italianImmersionScale}/5` : null} />
        <Field label="Curriculum Preference" value={form.curriculumPreference} />
        <Field label="Mid-Year Entry" value={form.midYearEntry} />
        <Field label="University Targets" value={form.universityTarget} />
        <div className="md:col-span-2">
          <Field label="Learning Needs (Confidential)" value={form.learningNeeds} />
        </div>
      </Section>

      <Section title="Section 5 — Professional & Fiscal">
        <Field label="Professional Situation" value={form.professionalSituation} />
        <Field label="Partner Situation" value={form.partnerProfSituation} />
        <Field label="Flat Tax Interest" value={form.flatTaxInterest} />
        <Field label="Lived in Italy Last 9 Years" value={form.livedInItalyLast9} />
        <Field label="Has Commercialista" value={form.hasCommercialista} />
        <Field label="Banking Needs" value={form.bankingNeeds} />
      </Section>

      <Section title="Section 6 — Lifestyle">
        <Field label="Lifestyle Descriptors" value={form.lifestyleDescriptors} />
        <Field label="Hobbies" value={form.hobbies} />
        <Field label="Social Network Scale" value={form.socialNetworkScale ? `${form.socialNetworkScale}/5` : null} />
        <Field label="Italian Level (You)" value={form.italianLevelYou} />
        <Field label="Italian Level (Partner)" value={form.italianLevelPartner} />
        <Field label="Healthcare Needs" value={form.healthcareNeeds} />
        <div className="md:col-span-2">
          <Field label="Health Notes (Confidential)" value={form.healthcareOther} />
        </div>
        <Field label="Dietary Notes" value={form.dietaryNotes} />
      </Section>

      <Section title="Section 7 — Priorities">
        <Field label="Top Priorities" value={form.topPriorities} />
        <Field label="Previous Relo Scale" value={form.prevReloScale ? `${form.prevReloScale}/5` : null} />
        <Field label="Comms Preference" value={form.commsPref} />
        <Field label="Timezone" value={form.timezone} />
        <Field label="Additional Decision-Maker" value={form.additionalDecisionMaker} />
        <Field label="Heard About DOMUS" value={form.heardAboutDomus} />
        <div className="md:col-span-2">
          <Field label="Biggest Anxiety" value={form.biggestAnxiety} />
        </div>
        <div className="md:col-span-2">
          <Field label="What Went Wrong Before" value={form.prevReloWentWrong} />
        </div>
        <div className="md:col-span-2">
          <Field label="Anything Else" value={form.anythingElse} />
        </div>
      </Section>
    </div>
  );
}

// ─── Submissions Table ────────────────────────────────────────────────────────
function SubmissionsTable({ onSelect }: { onSelect: (id: number) => void }) {
  const { data: submissions = [], isLoading } = trpc.intake.listSubmissions.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[var(--domus-gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-20 border border-[var(--domus-gold)]/20">
        <FileText size={32} className="text-[var(--domus-gold)]/40 mx-auto mb-4" />
        <p className="text-[var(--domus-grey)] text-sm">No intake submissions yet.</p>
        <p className="text-xs text-[var(--domus-grey)]/60 mt-1">Submissions will appear here once clients complete the questionnaire.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--domus-gold)]/20">
            {["Family", "Target City", "Arrival", "Submitted", "Advisor Brief", "Client Preview", "Advisor"].map((h) => (
              <th key={h} className="text-left text-xs tracking-widest uppercase text-[var(--domus-grey)] py-3 pr-4 font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(submissions as Submission[]).map((sub) => (
            <tr
              key={sub.id}
              onClick={() => onSelect(sub.id)}
              className="border-b border-[var(--domus-gold)]/10 hover:bg-[var(--domus-gold)]/5 cursor-pointer transition-colors"
            >
              <td className="py-3 pr-4">
                <div>
                  <p className="font-medium text-[var(--domus-charcoal)]">{sub.primaryName}</p>
                  <p className="text-xs text-[var(--domus-grey)]">{sub.email}</p>
                </div>
              </td>
              <td className="py-3 pr-4 text-[var(--domus-charcoal)]">
                {Array.isArray(sub.targetCity) ? (sub.targetCity as string[]).join(", ") : "—"}
              </td>
              <td className="py-3 pr-4 text-[var(--domus-charcoal)]">
                {sub.arrivalDate || "—"}
              </td>
              <td className="py-3 pr-4 text-[var(--domus-grey)] text-xs">
                {formatDate(sub.submittedAt)}
              </td>
              <td className="py-3 pr-4">
                <StatusBadge sent={sub.advisorBriefSent} label={sub.advisorBriefSent ? "Sent" : "Pending"} />
              </td>
              <td className="py-3 pr-4">
                <StatusBadge sent={sub.clientPreviewSent} label={sub.clientPreviewSent ? "Sent" : "Pending"} />
              </td>
              <td className="py-3 pr-4 text-[var(--domus-grey)] text-xs">
                {sub.assignedAdvisor || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function IntakeForms() {
  const meQuery = trpc.auth.me.useQuery();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const user = meQuery.data;
  const loading = meQuery.isLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--domus-ivory)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--domus-gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    window.location.replace("/login");
    return null;
  }

  if (user.email !== ADMIN_EMAIL) {
    window.location.replace("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--domus-ivory)]">
      {/* Header */}
      <header className="border-b border-[var(--domus-gold)]/20 bg-[var(--domus-ivory)]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xs tracking-widest uppercase text-[var(--domus-grey)] hover:text-[var(--domus-charcoal)] transition-colors flex items-center gap-1.5">
              <ChevronLeft size={14} /> Admin Hub
            </Link>
            <div className="w-px h-4 bg-[var(--domus-gold)]/30" />
            <h1 className="font-['Cormorant_Garamond'] text-xl text-[var(--domus-charcoal)] font-light">Intake Forms</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--domus-grey)]">{user.email}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {selectedId !== null ? (
          <DetailView id={selectedId} onBack={() => setSelectedId(null)} />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-2xl text-[var(--domus-charcoal)] font-light">Private Client Submissions</h2>
                <p className="text-sm text-[var(--domus-grey)] mt-1">Click any row to view the full questionnaire and manage AI documents.</p>
              </div>
            </div>
            <SubmissionsTable onSelect={setSelectedId} />
          </div>
        )}
      </main>
    </div>
  );
}
