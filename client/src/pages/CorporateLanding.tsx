import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Compass } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

function LeadForm() {
  const [form, setForm] = useState({ companyName: "", workEmail: "", contactName: "", relocationsPerYear: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const submit = trpc.corporate.submitLead.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (error) => toast.error(error.message || "Something went wrong. Please try again."),
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.companyName || !form.workEmail || !form.relocationsPerYear) {
      toast.error("Please complete the required fields.");
      return;
    }
    submit.mutate(form);
  }

  if (submitted) {
    return (
      <div className="domus-meridian-success">
        <Compass size={23} aria-hidden="true" />
        <h3>Request received.</h3>
        <p>Thank you. The DOMUS team will review your enquiry and reply within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="domus-meridian-form">
      <div className="domus-meridian-form-grid">
        <label>Company name <span>*</span>
          <Input value={form.companyName} onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))} placeholder="Company name" required />
        </label>
        <label>Work email <span>*</span>
          <Input type="email" value={form.workEmail} onChange={(event) => setForm((current) => ({ ...current, workEmail: event.target.value }))} placeholder="name@company.com" required />
        </label>
        <label>Contact name
          <Input value={form.contactName} onChange={(event) => setForm((current) => ({ ...current, contactName: event.target.value }))} placeholder="Your full name" />
        </label>
        <label>Relocations per year <span>*</span>
          <select value={form.relocationsPerYear} onChange={(event) => setForm((current) => ({ ...current, relocationsPerYear: event.target.value }))} required>
            <option value="">Select range</option>
            <option value="1 to 5">1 to 5</option>
            <option value="6 to 15">6 to 15</option>
            <option value="16 to 30">16 to 30</option>
            <option value="31 to 50">31 to 50</option>
            <option value="More than 50">More than 50</option>
          </select>
        </label>
      </div>
      <label>Tell us about your programme
        <textarea value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} placeholder="Destinations, priorities, or questions" rows={4} />
      </label>
      <Button type="submit" disabled={submit.isPending} className="domus-meridian-submit">
        {submit.isPending ? "Sending request" : "Request private access"} <ArrowRight size={14} />
      </Button>
      <p className="domus-meridian-form-note">Already have an access code? <Link href="/corporate/activate">Activate your account.</Link></p>
    </form>
  );
}

const capabilities = [
  ["01", "Assignment visibility", "A considered view of every active move, from offer acceptance to a settled arrival."],
  ["02", "DOMUS Meridian intelligence", "A personal pre move intelligence brief for each assignee, shaped by AI and refined by DOMUS."],
  ["03", "Cost clarity", "Reliable relocation cost ranges by city, neighbourhood, and family profile, maintained by the DOMUS team."],
  ["04", "Privacy by design", "Names remain private by default. Mobility teams see only the level of detail appropriate to their role."],
  ["05", "A trusted Italian network", "Direct access to the selected school, tax, healthcare, property, and lifestyle specialists each move requires."],
  ["06", "A dedicated contact", "Complex cases, escalations, and family needs receive considered support from a real DOMUS adviser."],
];

export default function CorporateLanding() {
  return (
    <main className="domus-meridian-page">
      <nav className="domus-meridian-nav">
        <Link href="/" className="domus-meridian-wordmark">DOMUS <span>Relocations</span></Link>
        <div>
          <Link href="/" className="domus-meridian-private-link">Private clients</Link>
          <Link href="/corporate/activate" className="domus-meridian-nav-action">Activate account</Link>
        </div>
      </nav>

      <section className="domus-meridian-hero">
        <div className="container domus-meridian-hero-layout">
          <div>
            <span className="section-label">Corporate relocation</span>
            <span className="domus-meridian-rule" aria-hidden="true" />
            <h1>DOMUS <em>Meridian.</em><br />The confidence behind every move.</h1>
            <p>
              A discreet relocation platform for HR and global mobility teams managing executive moves to Italy. Clear intelligence, considered support, and the full DOMUS network in one private place.
            </p>
            <div className="domus-meridian-hero-actions">
              <a href="#enquire" className="domus-meridian-hero-primary">Request private access <ArrowRight size={14} /></a>
              <Link href="/corporate/activate" className="domus-meridian-hero-secondary">I have an access code</Link>
            </div>
          </div>
          <aside className="domus-meridian-hero-aside">
            <span>Meridian in practice</span>
            <dl>
              <div><dt>Intelligence</dt><dd>Every assignee begins with a personal relocation picture.</dd></div>
              <div><dt>Visibility</dt><dd>Milestones and progress are clear without compromising privacy.</dd></div>
              <div><dt>Continuity</dt><dd>A dedicated DOMUS point of contact for the details that need judgement.</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="domus-meridian-capabilities">
        <div className="container">
          <header>
            <span className="section-label">A more intelligent relocation programme</span>
            <h2>Built for people who expect <em>more than a platform.</em></h2>
          </header>
          <div className="domus-meridian-capability-list">
            {capabilities.map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="enquire" className="domus-meridian-enquire">
        <div className="container domus-meridian-enquire-layout">
          <header>
            <span className="section-label">Private access</span>
            <span className="domus-meridian-rule" aria-hidden="true" />
            <h2>Bring greater certainty to every <em>arrival.</em></h2>
            <p>Share a few details about your mobility programme. We will arrange a private conversation with the DOMUS team.</p>
          </header>
          <div className="domus-meridian-form-panel"><LeadForm /></div>
        </div>
      </section>

      <footer className="domus-meridian-footer">
        <p>© {new Date().getFullYear()} DOMUS Relocations. All rights reserved.</p>
        <Link href="/">Return to private relocation</Link>
      </footer>
    </main>
  );
}
