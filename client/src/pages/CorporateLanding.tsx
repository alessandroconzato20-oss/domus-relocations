/**
 * DOMUS Meridian — Corporate Landing Page (/corporate)
 * Luxury, high-end, clean — matching the main site aesthetic.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Building2, Users, BarChart3, Shield, Compass, ArrowRight } from "lucide-react";

// ─── Lead Form ────────────────────────────────────────────────────────────────
function LeadForm() {
  const [form, setForm] = useState({
    companyName: "",
    workEmail: "",
    contactName: "",
    relocationsPerYear: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submit = trpc.corporate.submitLead.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (e) => toast.error(e.message || "Something went wrong. Please try again."),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.companyName || !form.workEmail || !form.relocationsPerYear) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submit.mutate(form);
  }

  if (submitted) {
    return (
      <div className="text-center py-16 px-8">
        <div className="w-12 h-12 border border-[#B8963E] flex items-center justify-center mx-auto mb-6">
          <Compass size={22} className="text-[#B8963E]" />
        </div>
        <h3 className="font-cormorant text-2xl text-stone-800 mb-3">Request Received</h3>
        <p className="text-stone-500 text-sm leading-relaxed max-w-sm mx-auto">
          Thank you. Our team will review your enquiry and be in touch within one business day with your DOMUS Meridian access credentials.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Company Name <span className="text-[#B8963E]">*</span></label>
          <Input
            value={form.companyName}
            onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
            placeholder="Acme Corporation"
            className="border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm h-11 rounded-none"
            required
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Work Email <span className="text-[#B8963E]">*</span></label>
          <Input
            type="email"
            value={form.workEmail}
            onChange={e => setForm(f => ({ ...f, workEmail: e.target.value }))}
            placeholder="hr@company.com"
            className="border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm h-11 rounded-none"
            required
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Contact Name</label>
          <Input
            value={form.contactName}
            onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
            placeholder="Your full name"
            className="border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm h-11 rounded-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Relocations per year <span className="text-[#B8963E]">*</span></label>
          <select
            value={form.relocationsPerYear}
            onChange={e => setForm(f => ({ ...f, relocationsPerYear: e.target.value }))}
            className="w-full border border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm h-11 px-3 rounded-none text-stone-700"
            required
          >
            <option value="">Select range</option>
            <option value="1–5">1 – 5</option>
            <option value="6–15">6 – 15</option>
            <option value="16–30">16 – 30</option>
            <option value="31–50">31 – 50</option>
            <option value="50+">50+</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-1.5">Message (optional)</label>
        <textarea
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="Tell us about your relocation programme, specific destinations, or any questions."
          rows={4}
          className="w-full border border-[#D4C5B0] focus:border-[#B8963E] bg-white text-sm px-3 py-2.5 rounded-none resize-none outline-none focus:outline-none transition-colors text-stone-700 placeholder:text-stone-400"
        />
      </div>
      <Button
        type="submit"
        disabled={submit.isPending}
        className="w-full bg-[#B8963E] hover:bg-[#9A7D33] text-white text-xs uppercase tracking-widest h-12 rounded-none transition-colors"
      >
        {submit.isPending ? "Submitting…" : "Request Access →"}
      </Button>
      <p className="text-xs text-stone-400 text-center">
        Already have an access code?{" "}
        <Link href="/corporate/activate" className="text-[#B8963E] hover:underline">Activate your account here.</Link>
      </p>
    </form>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="border border-[#E8DFD0] bg-white p-7 hover:border-[#D4AF6A] transition-colors">
      <div className="text-[#B8963E] mb-4">{icon}</div>
      <h3 className="font-cormorant text-lg text-stone-800 mb-2">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CorporateLanding() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Nav */}
      <nav className="border-b border-[#E8DFD0] bg-white/95 backdrop-blur-sm sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
        <Link href="/">
          <span className="font-cormorant text-xl text-stone-800 tracking-wide cursor-pointer">
            DOMUS <span className="text-[#B8963E]">Relocations</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 transition-colors">
            Private Clients
          </Link>
          <Link href="/corporate/activate">
            <Button variant="outline" className="text-xs uppercase tracking-widest border-[#B8963E] text-[#B8963E] hover:bg-[#B8963E] hover:text-white rounded-none h-9 px-5 transition-colors">
              Activate Account
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-24 pb-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#B8963E] mb-5">DOMUS Meridian</p>
            <h1 className="font-cormorant text-5xl md:text-6xl text-stone-800 leading-tight mb-6">
              Corporate Relocation,<br />
              <em className="not-italic text-[#B8963E]">Elevated.</em>
            </h1>
            <p className="text-stone-500 text-base leading-relaxed mb-8 max-w-md">
              DOMUS Meridian gives HR and Global Mobility teams a single, intelligent platform to manage executive relocations to Milan — with real-time assignment tracking, accurate cost modelling, and the full DOMUS concierge network at your disposal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#enquire">
                <Button className="bg-[#B8963E] hover:bg-[#9A7D33] text-white text-xs uppercase tracking-widest h-12 px-8 rounded-none transition-colors">
                  Request Access <ArrowRight size={14} className="ml-2" />
                </Button>
              </a>
              <Link href="/corporate/activate">
                <Button variant="outline" className="border-stone-300 text-stone-600 hover:border-stone-500 text-xs uppercase tracking-widest h-12 px-8 rounded-none transition-colors">
                  I Have a Code
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats panel */}
          <div className="border border-[#E8DFD0] bg-white p-8 space-y-6">
            <p className="text-xs uppercase tracking-widest text-stone-400">Why DOMUS Meridian</p>
            {[
              { stat: "100%", label: "of assignments tracked in real time" },
              { stat: "AI-first", label: "DOMUS Meridian pre-move intelligence brief per employee" },
              { stat: "One portal", label: "for HR, mobility managers, and the DOMUS team" },
              { stat: "Milan-only", label: "deep local expertise — not a generic global platform" },
            ].map(({ stat, label }) => (
              <div key={stat} className="flex items-start gap-4 border-b border-[#F0EBE3] pb-5 last:border-0 last:pb-0">
                <span className="font-cormorant text-2xl text-[#B8963E] leading-none min-w-[80px]">{stat}</span>
                <span className="text-stone-500 text-sm leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 bg-white border-y border-[#E8DFD0]">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-[#B8963E] mb-3 text-center">Platform Features</p>
          <h2 className="font-cormorant text-4xl text-stone-800 text-center mb-14">Everything your mobility team needs.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BarChart3 size={22} />}
              title="Assignment Dashboard"
              description="Track every employee relocation from offer acceptance to settled arrival — housing, schools, documentation, banking, and healthcare milestones in one view."
            />
            <FeatureCard
              icon={<Compass size={22} />}
              title="DOMUS Meridian AI Brief"
              description="Each assignee receives a personalised pre-move intelligence brief — generated by AI, curated by DOMUS — covering neighbourhood fit, school options, fiscal timing, and integration roadmap."
            />
            <FeatureCard
              icon={<BarChart3 size={22} />}
              title="Cost Estimator"
              description="Accurate, up-to-date relocation cost modelling by city, neighbourhood, and family profile — built on live DOMUS market data, not generic benchmarks."
            />
            <FeatureCard
              icon={<Users size={22} />}
              title="Privacy-First Reporting"
              description="Employee names are hidden by default. HR sees initials and seniority bands only. Full names are unlocked only when your team explicitly enables them."
            />
            <FeatureCard
              icon={<Building2 size={22} />}
              title="Concierge Network Access"
              description="Every DOMUS Meridian account includes access to our vetted Milan network — tax advisors, international schools, healthcare providers, and property specialists."
            />
            <FeatureCard
              icon={<Shield size={22} />}
              title="Secure & Dedicated"
              description="Each corporate account is access-code gated and isolated. Your data is never shared across accounts. GDPR-compliant by design."
            />
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquire" className="px-8 py-24">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-[#B8963E] mb-3 text-center">Get Started</p>
          <h2 className="font-cormorant text-4xl text-stone-800 text-center mb-3">Request DOMUS Meridian Access</h2>
          <p className="text-stone-500 text-sm text-center mb-10 leading-relaxed">
            Submit your details below. Our team will review your enquiry and send your access credentials within one business day.
          </p>
          <div className="border border-[#E8DFD0] bg-white p-8">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8DFD0] bg-white px-8 py-8 text-center">
        <p className="text-xs text-stone-400 tracking-wide">
          © {new Date().getFullYear()} DOMUS Relocations. All rights reserved.{" "}
          <Link href="/" className="text-[#B8963E] hover:underline">Private Client Portal →</Link>
        </p>
      </footer>
    </div>
  );
}
