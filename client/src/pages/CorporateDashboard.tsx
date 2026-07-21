/**
 * DOMUS Meridian — Corporate Dashboard (/corporate/dashboard)
 * Assignment tracker + cost estimator
 */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Compass, BarChart3, LogOut, Settings, ChevronRight } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "text-stone-500 bg-stone-50 border border-stone-200",
    on_track: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    needs_attention: "text-amber-700 bg-amber-50 border border-amber-200",
    completed: "text-[#B8963E] bg-[#FAF6EE] border border-[#D4AF6A]",
  };
  const labels: Record<string, string> = {
    new: "New",
    on_track: "On Track",
    needs_attention: "Needs Attention",
    completed: "Completed",
  };
  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 ${map[status] ?? map.new}`}>
      {labels[status] ?? status}
    </span>
  );
}

function MilestoneBar({ milestones, progress }: { milestones: any; progress: number }) {
  const keys = ["housing", "school", "documentation", "banking", "healthcare"] as const;
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {keys.map(k => {
          const v = milestones?.[k];
          if (v === "na") return <div key={k} className="flex-1 h-1.5 bg-stone-100" title={k} />;
          return (
            <div
              key={k}
              className={`flex-1 h-1.5 transition-colors ${
                v === "completed" ? "bg-[#B8963E]" : v === "in_progress" ? "bg-[#D4AF6A]" : "bg-stone-200"
              }`}
              title={k}
            />
          );
        })}
      </div>
      <p className="text-xs text-stone-400">{progress}% complete</p>
    </div>
  );
}

// ─── Cost Estimator ───────────────────────────────────────────────────────────
function CostEstimator() {
  const { data: cities } = trpc.corporate.getCities.useQuery();
  const [city, setCity] = useState("");
  const [profile, setProfile] = useState<"solo" | "couple" | "family_children">("solo");

  const { data: costRows, isLoading } = trpc.corporate.getCostData.useQuery(
    { city, profileType: profile },
    { enabled: !!city }
  );

  const summary = useMemo(() => {
    if (!costRows?.length) return null;
    // Average across sub-areas
    const avg = (arr: (number | null | undefined)[]) => {
      const valid = arr.filter((v): v is number => v != null);
      return valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
    };
    return {
      rentMin: avg(costRows.map(r => r.rentRangeMin)),
      rentMax: avg(costRows.map(r => r.rentRangeMax)),
      schoolMin: avg(costRows.map(r => r.schoolFeeRangeMin)),
      schoolMax: avg(costRows.map(r => r.schoolFeeRangeMax)),
      setup: avg(costRows.map(r => r.setupCostEstimate)),
      healthcare: avg(costRows.map(r => r.healthcareCostEstimate)),
      feeMin: avg(costRows.map(r => r.domusServiceFeeMin)),
      feeMax: avg(costRows.map(r => r.domusServiceFeeMax)),
      quality: costRows[0]?.dataQuality,
    };
  }, [costRows]);

  const fmt = (n: number | null | undefined) => n != null ? `€${n.toLocaleString()}` : "—";

  return (
    <div className="border border-[#E8DFD0] bg-white p-7">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 size={18} className="text-[#B8963E]" />
        <h2 className="font-cormorant text-xl text-stone-800">Relocation Cost Estimator</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Destination City</label>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full border border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm h-10 px-3 rounded-none text-stone-700"
          >
            <option value="">Select city…</option>
            {cities?.map(c => (
              <option key={c.city} value={c.city}>{c.city}{c.dataQuality === "limited" ? " (limited data)" : ""}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Employee Profile</label>
          <select
            value={profile}
            onChange={e => setProfile(e.target.value as any)}
            className="w-full border border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm h-10 px-3 rounded-none text-stone-700"
          >
            <option value="solo">Solo</option>
            <option value="couple">Couple</option>
            <option value="family_children">Family with children</option>
          </select>
        </div>
      </div>

      {!city && (
        <p className="text-stone-400 text-sm text-center py-8 italic">Select a city to see cost estimates.</p>
      )}

      {city && isLoading && (
        <p className="text-stone-400 text-sm text-center py-8">Loading estimates…</p>
      )}

      {city && !isLoading && !costRows?.length && (
        <div className="border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-amber-700 text-sm">No cost data available for this combination yet. Contact the DOMUS team for a bespoke estimate.</p>
        </div>
      )}

      {summary && (
        <>
          {summary.quality === "limited" && (
            <div className="border border-[#D4AF6A] bg-[#FAF6EE] px-4 py-2 mb-5 text-xs text-[#9A7D33]">
              ⚠ Limited data available for this city. Estimates are indicative only.
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Monthly Rent", value: `${fmt(summary.rentMin)} – ${fmt(summary.rentMax)}` },
              { label: "Annual School Fees", value: profile === "family_children" ? `${fmt(summary.schoolMin)} – ${fmt(summary.schoolMax)}` : "N/A" },
              { label: "Setup & Admin (one-off)", value: fmt(summary.setup) },
              { label: "Healthcare (annual)", value: fmt(summary.healthcare) },
            ].map(({ label, value }) => (
              <div key={label} className="border border-[#E8DFD0] p-4">
                <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">{label}</p>
                <p className="font-cormorant text-xl text-stone-800">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border border-[#D4AF6A] bg-[#FAF6EE] p-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">DOMUS Service Fee</p>
              <p className="font-cormorant text-xl text-[#B8963E]">{fmt(summary.feeMin)} – {fmt(summary.feeMax)}</p>
            </div>
            <p className="text-xs text-stone-400 max-w-[200px] text-right leading-relaxed">
              Inclusive of full concierge, school placement, and DOMUS Meridian AI Brief.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Assignment List ──────────────────────────────────────────────────────────
function AssignmentList({ showFullNames }: { showFullNames: boolean }) {
  const { data: assignments, isLoading } = trpc.corporate.getAssignments.useQuery();

  if (isLoading) return <p className="text-stone-400 text-sm py-8 text-center">Loading assignments…</p>;

  if (!assignments?.length) {
    return (
      <div className="border border-[#E8DFD0] bg-white p-10 text-center">
        <Compass size={28} className="text-stone-300 mx-auto mb-4" />
        <p className="text-stone-400 text-sm">No assignments yet. Contact the DOMUS team to add your first employee relocation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assignments.map(a => (
        <div key={a.id} className="border border-[#E8DFD0] bg-white p-5 hover:border-[#D4AF6A] transition-colors">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-cormorant text-lg text-stone-800">
                  {showFullNames && a.employeeFullName ? a.employeeFullName : a.employeeInitials}
                </span>
                <span className="text-xs text-stone-400 uppercase tracking-widest">{a.seniorityBand}</span>
                <span className="text-xs text-stone-400 uppercase tracking-widest">·</span>
                <span className="text-xs text-stone-400 uppercase tracking-widest">
                  {{ solo: "Solo", couple: "Couple", family_children: "Family" }[a.familySize]}
                </span>
              </div>
              <p className="text-sm text-stone-500">{a.destinationCity}</p>
            </div>
            <StatusPill status={a.status} />
          </div>
          <MilestoneBar milestones={a.milestones} progress={a.progressPercent} />
          {a.notes && (
            <p className="text-xs text-stone-400 mt-3 border-t border-[#F0EBE3] pt-3">{a.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CorporateDashboard() {
  const { user, loading, logout } = useAuth();
  const [, navigate] = useLocation();
  const { data: account, isLoading: accountLoading } = trpc.corporate.getMyAccount.useQuery(
    undefined,
    { enabled: !!user }
  );
  const updateSettings = trpc.corporate.updateAccountSettings.useMutation({
    onSuccess: () => { toast.success("Settings updated."); utils.corporate.getMyAccount.invalidate(); },
  });
  const utils = trpc.useUtils();

  if (loading || accountLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <p className="text-stone-400 text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-8">
        <div className="text-center max-w-sm">
          <h2 className="font-cormorant text-2xl text-stone-800 mb-3">Sign in required</h2>
          <p className="text-stone-500 text-sm mb-6">Please sign in to access your DOMUS Meridian dashboard.</p>
          <a href={getLoginUrl()}>
            <Button className="bg-[#B8963E] hover:bg-[#9A7D33] text-white text-xs uppercase tracking-widest h-11 px-8 rounded-none">
              Sign In
            </Button>
          </a>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-8">
        <div className="text-center max-w-sm">
          <Compass size={32} className="text-stone-300 mx-auto mb-5" />
          <h2 className="font-cormorant text-2xl text-stone-800 mb-3">No Corporate Account Found</h2>
          <p className="text-stone-500 text-sm mb-6">
            Your account is not linked to a DOMUS Meridian corporate account. Please activate using your access code.
          </p>
          <Link href="/corporate/activate">
            <Button className="bg-[#B8963E] hover:bg-[#9A7D33] text-white text-xs uppercase tracking-widest h-11 px-8 rounded-none">
              Activate Account
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const showFullNames = Boolean(account.showFullNames);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <nav className="border-b border-[#E8DFD0] bg-white px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/corporate">
            <span className="font-cormorant text-xl text-stone-800 tracking-wide cursor-pointer">
              DOMUS <span className="text-[#B8963E]">Meridian</span>
            </span>
          </Link>
          <span className="text-stone-300">·</span>
          <span className="text-sm text-stone-500">{account.companyName}</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => updateSettings.mutate({ showFullNames: !showFullNames })}
            className={`text-xs uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
              showFullNames ? "text-[#B8963E]" : "text-stone-400 hover:text-stone-600"
            }`}
            title={showFullNames ? "Hide full names" : "Show full names"}
          >
            <Settings size={13} />
            {showFullNames ? "Names visible" : "Names hidden"}
          </button>
          <button
            onClick={() => { logout(); navigate("/corporate"); }}
            className="text-xs uppercase tracking-widest text-stone-400 hover:text-stone-700 flex items-center gap-1.5 transition-colors"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="px-8 py-10 max-w-6xl mx-auto space-y-10">
        {/* Welcome */}
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#B8963E] mb-1">DOMUS Meridian</p>
          <h1 className="font-cormorant text-3xl text-stone-800">
            Welcome, {user.name || account.companyName}
          </h1>
          <p className="text-stone-500 text-sm mt-1">Corporate Relocation Dashboard — {account.companyName}</p>
        </div>

        {/* Cost Estimator */}
        <CostEstimator />

        {/* Assignments */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-cormorant text-2xl text-stone-800">Active Assignments</h2>
            <p className="text-xs text-stone-400">Contact DOMUS to add or update assignments.</p>
          </div>
          <AssignmentList showFullNames={showFullNames} />
        </div>
      </div>
    </div>
  );
}
