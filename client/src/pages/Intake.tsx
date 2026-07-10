/*
 * DOMUS Relocations — Private Client Intake Questionnaire
 * 7-section multi-step form with gold progress bar, per-section validation,
 * and a confirmation screen. Fully responsive.
 */

import { useState, useCallback, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Plus, Trash2, Check } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Child = {
  name: string;
  dateOfBirth: string;
  currentSchool: string;
  currentCurriculum: string;
  yearGrade: string;
  languagesSpoken: string;
  academicLevel: string;
  strongestSubjects: string;
  weakestSubjects: string;
  extracurriculars: string;
  personality: string;
};

type ChildEduProfile = {
  childName: string;
  academicStrengths: string;
  extracurriculars: string;
  continuityEssential: string;
};

type FormData = {
  // Section 1
  primaryName: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  whoRelocating: string[];
  partnerName: string;
  partnerNationality: string;
  partnerLanguages: string;
  children: Child[];
  pets: string[];
  // Section 2
  fromCity: string;
  nationalities: string;
  moveReasons: string[];
  arrivalDate: string;
  dateFirmness: string;
  intendedDuration: string[];
  targetCity: string[];
  livedInItalyBefore: string;
  previousCountries: string;
  // Section 3
  rentOrBuy: string[];
  budget: string[];
  bedrooms: string;
  propertyType: string;
  propertyRequirements: string[];
  neighbourhoodVibe: string[];
  neighbourhoodInterest: string;
  previousHomeNotes: string;
  // Section 4
  childEduProfiles: ChildEduProfile[];
  italianImmersionScale: number;
  curriculumPreference: string[];
  midYearEntry: string[];
  learningNeeds: string;
  universityTarget: string;
  // Section 5
  professionalSituation: string[];
  partnerProfSituation: string[];
  flatTaxInterest: string[];
  livedInItalyLast9: string[];
  hasCommercialista: string[];
  bankingNeeds: string[];
  // Section 6
  lifestyleDescriptors: string[];
  hobbies: string;
  socialNetworkScale: number;
  italianLevelYou: string;
  italianLevelPartner: string;
  healthcareNeeds: string[];
  healthcareOther: string;
  dietaryNotes: string;
  // Section 7
  topPriorities: string[];
  biggestAnxiety: string;
  prevReloScale: number;
  prevReloWentWrong: string;
  commsPref: string[];
  timezone: string;
  additionalDecisionMaker: string;
  anythingElse: string;
  heardAboutDomus: string[];
};

const defaultChild = (): Child => ({
  name: "", dateOfBirth: "", currentSchool: "", currentCurriculum: "", yearGrade: "", languagesSpoken: "",
  academicLevel: "", strongestSubjects: "", weakestSubjects: "", extracurriculars: "", personality: "",
});

const defaultEduProfile = (childName: string): ChildEduProfile => ({
  childName, academicStrengths: "", extracurriculars: "", continuityEssential: "",
});

const initialForm: FormData = {
  primaryName: "", email: "", phone: "", preferredLanguage: "English",
  whoRelocating: [], partnerName: "", partnerNationality: "", partnerLanguages: "",
  children: [], pets: [],
  fromCity: "", nationalities: "", moveReasons: [], arrivalDate: "", dateFirmness: "",
  intendedDuration: [], targetCity: [], livedInItalyBefore: "", previousCountries: "",
  rentOrBuy: [], budget: [], bedrooms: "", propertyType: "", propertyRequirements: [],
  neighbourhoodVibe: [], neighbourhoodInterest: "", previousHomeNotes: "",
  childEduProfiles: [], italianImmersionScale: 3, curriculumPreference: [],
  midYearEntry: [], learningNeeds: "", universityTarget: "",
  professionalSituation: [], partnerProfSituation: [], flatTaxInterest: [],
  livedInItalyLast9: [], hasCommercialista: [], bankingNeeds: [],
  lifestyleDescriptors: [], hobbies: "", socialNetworkScale: 3,
  italianLevelYou: "", italianLevelPartner: "", healthcareNeeds: [], healthcareOther: "", dietaryNotes: "",
  topPriorities: [], biggestAnxiety: "", prevReloScale: 3, prevReloWentWrong: "",
  commsPref: [], timezone: "", additionalDecisionMaker: "", anythingElse: "", heardAboutDomus: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

function MultiSelect({
  options, value, onChange, max,
}: {
  options: string[]; value: string[]; onChange: (v: string[]) => void; max?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value.includes(opt);
        const disabled = !selected && max !== undefined && value.length >= max;
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => onChange(toggle(value, opt))}
            className={`px-3 py-1.5 text-sm border transition-all duration-150 ${
              selected
                ? "border-[var(--domus-gold)] bg-[var(--domus-gold)] text-[var(--domus-charcoal)] font-medium"
                : "border-[var(--domus-grey)] text-[var(--domus-charcoal)] hover:border-[var(--domus-gold)] disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ScaleInput({
  value, onChange, labels,
}: {
  value: number; onChange: (v: number) => void; labels: [string, string];
}) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-10 h-10 border text-sm font-medium transition-all ${
              value === n
                ? "border-[var(--domus-gold)] bg-[var(--domus-gold)] text-[var(--domus-charcoal)]"
                : "border-[var(--domus-grey)] text-[var(--domus-charcoal)] hover:border-[var(--domus-gold)]"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-[var(--domus-grey)]">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </div>
    </div>
  );
}

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <Label className="text-xs tracking-widest uppercase text-[var(--domus-charcoal)] font-medium">
      {children}
      {optional && <span className="ml-1 text-[var(--domus-grey)] normal-case tracking-normal font-normal">(optional)</span>}
    </Label>
  );
}

function SectionTitle({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs tracking-widest text-[var(--domus-gold)] uppercase mb-1">Section {number}</p>
      <h2 className="font-['Cormorant_Garamond'] text-3xl text-[var(--domus-charcoal)] font-light">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-[var(--domus-grey)] leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-[var(--domus-gold)]/20 my-6" />;
}

// ─── DOMUS Logo ───────────────────────────────────────────────────────────────
const DOMUS_LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/DomusRelocationsLogo_506fe4bc.png";

function DomusCrest({ size = 60 }: { size?: number }) {
  return (
    <img src={DOMUS_LOGO_URL} alt="DOMUS Relocations" style={{ height: size, width: "auto", objectFit: "contain" }} />
  );
}

// ─── Section 1: The Family ────────────────────────────────────────────────────
function Section1({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  const hasPartner = form.whoRelocating.includes("Partner / Spouse");
  const hasChildren = form.whoRelocating.includes("Children");

  const addChild = () => update({ children: [...form.children, defaultChild()] });
  const removeChild = (i: number) => {
    const newChildren = form.children.filter((_, idx) => idx !== i);
    update({ children: newChildren });
  };
  const updateChild = (i: number, patch: Partial<Child>) => {
    const newChildren = form.children.map((c, idx) => idx === i ? { ...c, ...patch } : c);
    update({ children: newChildren });
  };

  return (
    <div className="space-y-6">
      <SectionTitle number="01" title="The Family" subtitle="Tell us about who will be making this move. The more we understand your household, the more precisely we can prepare." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <FieldLabel>Your Full Name</FieldLabel>
          <Input value={form.primaryName} onChange={(e) => update({ primaryName: e.target.value })} placeholder="e.g. Isabelle Fontaine" className="intake-input" />
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Email Address</FieldLabel>
          <Input type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} placeholder="your@email.com" className="intake-input" />
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>Phone Number</FieldLabel>
          <Input value={form.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="+44 7700 000000" className="intake-input" />
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Preferred Language</FieldLabel>
          <select
            value={form.preferredLanguage}
            onChange={(e) => update({ preferredLanguage: e.target.value })}
            className="w-full h-10 px-3 text-sm border border-[var(--domus-grey)]/50 bg-transparent text-[var(--domus-charcoal)] focus:outline-none focus:border-[var(--domus-gold)]"
          >
            {["English","Italian","French","German","Spanish","Portuguese","Japanese","Mandarin","Russian","Arabic","Korean","Other"].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <Divider />

      <div className="space-y-2">
        <FieldLabel>Who is relocating?</FieldLabel>
        <MultiSelect
          options={["Myself only", "Partner / Spouse", "Children", "Extended family member"]}
          value={form.whoRelocating}
          onChange={(v) => update({ whoRelocating: v })}
        />
      </div>

      {hasPartner && (
        <>
          <Divider />
          <p className="text-xs tracking-widest uppercase text-[var(--domus-gold)]">Partner Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <FieldLabel optional>Partner's Full Name</FieldLabel>
              <Input value={form.partnerName} onChange={(e) => update({ partnerName: e.target.value })} placeholder="e.g. Marc Fontaine" className="intake-input" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel optional>Partner's Nationality</FieldLabel>
              <Input value={form.partnerNationality} onChange={(e) => update({ partnerNationality: e.target.value })} placeholder="e.g. French" className="intake-input" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel optional>Languages spoken by partner</FieldLabel>
              <Input value={form.partnerLanguages} onChange={(e) => update({ partnerLanguages: e.target.value })} placeholder="e.g. French, English, some Italian" className="intake-input" />
            </div>
          </div>
        </>
      )}

      {hasChildren && (
        <>
          <Divider />
          <div className="flex items-center justify-between">
            <p className="text-xs tracking-widest uppercase text-[var(--domus-gold)]">Children</p>
            <button type="button" onClick={addChild} className="flex items-center gap-1.5 text-xs text-[var(--domus-gold)] hover:text-[var(--domus-charcoal)] transition-colors">
              <Plus size={14} /> Add child
            </button>
          </div>
          {form.children.length === 0 && (
            <button type="button" onClick={addChild} className="w-full border border-dashed border-[var(--domus-gold)]/40 py-4 text-sm text-[var(--domus-grey)] hover:border-[var(--domus-gold)] transition-colors">
              + Add your first child to the DOMUS Family Profile
            </button>
          )}
          {form.children.map((child, i) => (
            <div key={i} className="border border-[var(--domus-gold)]/20 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-widest uppercase text-[var(--domus-grey)]">Child {i + 1}</p>
                <button type="button" onClick={() => removeChild(i)} className="text-[var(--domus-grey)] hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <FieldLabel>Name</FieldLabel>
                  <Input value={child.name} onChange={(e) => updateChild(i, { name: e.target.value })} placeholder="First name" className="intake-input" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Date of Birth</FieldLabel>
                  <Input type="date" value={child.dateOfBirth} onChange={(e) => updateChild(i, { dateOfBirth: e.target.value })} className="intake-input" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel optional>Current School</FieldLabel>
                  <Input value={child.currentSchool} onChange={(e) => updateChild(i, { currentSchool: e.target.value })} placeholder="e.g. Lycée Français de Londres" className="intake-input" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel optional>Current Curriculum</FieldLabel>
                  <Input value={child.currentCurriculum} onChange={(e) => updateChild(i, { currentCurriculum: e.target.value })} placeholder="e.g. IB, British, French, Montessori" className="intake-input" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel optional>Year / Grade</FieldLabel>
                  <Input value={child.yearGrade} onChange={(e) => updateChild(i, { yearGrade: e.target.value })} placeholder="e.g. Year 8 / Grade 7" className="intake-input" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel optional>Languages Spoken</FieldLabel>
                  <Input value={child.languagesSpoken} onChange={(e) => updateChild(i, { languagesSpoken: e.target.value })} placeholder="e.g. English, French" className="intake-input" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel optional>Current Academic Level</FieldLabel>
                  <Input value={child.academicLevel} onChange={(e) => updateChild(i, { academicLevel: e.target.value })} placeholder="e.g. Above average, Average, Needs support" className="intake-input" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel optional>Strongest Subjects</FieldLabel>
                  <Input value={child.strongestSubjects} onChange={(e) => updateChild(i, { strongestSubjects: e.target.value })} placeholder="e.g. Maths, Science" className="intake-input" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel optional>Weakest Subjects</FieldLabel>
                  <Input value={child.weakestSubjects} onChange={(e) => updateChild(i, { weakestSubjects: e.target.value })} placeholder="e.g. Languages, Writing" className="intake-input" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel optional>Extracurricular Activities</FieldLabel>
                  <Input value={child.extracurriculars} onChange={(e) => updateChild(i, { extracurriculars: e.target.value })} placeholder="e.g. Football, piano, swimming" className="intake-input" />
                </div>
              </div>
              <div className="space-y-1.5 mt-4">
                <FieldLabel optional>Personality</FieldLabel>
                <div className="flex gap-3">
                  {["Introverted", "Mostly introverted", "In between", "Mostly extroverted", "Extroverted"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateChild(i, { personality: child.personality === opt ? "" : opt })}
                      className={`flex-1 py-2 text-xs border transition-colors ${
                        child.personality === opt
                          ? "border-[var(--domus-gold)] bg-[var(--domus-gold)]/10 text-[var(--domus-charcoal)]"
                          : "border-[var(--domus-grey)]/30 text-[var(--domus-grey)] hover:border-[var(--domus-gold)]/60"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      <Divider />
      <div className="space-y-2">
        <FieldLabel optional>Pets</FieldLabel>
        <MultiSelect
          options={["Dog", "Cat", "Other"]}
          value={form.pets}
          onChange={(v) => update({ pets: v })}
        />
      </div>
    </div>
  );
}

// ─── Section 2: The Move ──────────────────────────────────────────────────────
function Section2({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-6">
      <SectionTitle number="02" title="The Move" subtitle="Understanding the shape of your move — where you are coming from, why you are going, and how much flexibility you have." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <FieldLabel>Current City / Country</FieldLabel>
          <Input value={form.fromCity} onChange={(e) => update({ fromCity: e.target.value })} placeholder="e.g. London, UK" className="intake-input" />
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>Nationalities in the household</FieldLabel>
          <Input value={form.nationalities} onChange={(e) => update({ nationalities: e.target.value })} placeholder="e.g. British, French" className="intake-input" />
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel>Why are you moving to Italy?</FieldLabel>
        <MultiSelect
          options={["Lifestyle & quality of life", "Work / business opportunity", "Family reasons", "Retirement", "Education for children", "Tax planning", "Remote work / digital nomad", "Returning to Italy", "Other"]}
          value={form.moveReasons}
          onChange={(v) => update({ moveReasons: v })}
        />
      </div>

      <Divider />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <FieldLabel optional>Target Arrival Date</FieldLabel>
          <Input type="month" value={form.arrivalDate} onChange={(e) => update({ arrivalDate: e.target.value })} className="intake-input" />
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>How firm is this date?</FieldLabel>
          <select
            value={form.dateFirmness}
            onChange={(e) => update({ dateFirmness: e.target.value })}
            className="w-full h-10 px-3 text-sm border border-[var(--domus-grey)]/50 bg-transparent text-[var(--domus-charcoal)] focus:outline-none focus:border-[var(--domus-gold)]"
          >
            <option value="">Select…</option>
            <option>Fixed — we must be there by this date</option>
            <option>Flexible within 1–2 months</option>
            <option>Flexible within 3–6 months</option>
            <option>No fixed date yet</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel optional>Intended duration in Italy</FieldLabel>
        <MultiSelect
          options={["1–2 years", "3–5 years", "Long-term / permanent", "Undecided"]}
          value={form.intendedDuration}
          onChange={(v) => update({ intendedDuration: v })}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel>Target city / region</FieldLabel>
        <MultiSelect
          options={["Milan", "Rome", "Florence", "Lake Como / Brianza", "Tuscany", "Liguria / Portofino", "Bologna", "Other"]}
          value={form.targetCity}
          onChange={(v) => update({ targetCity: v })}
        />
      </div>

      <Divider />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <FieldLabel optional>Have you lived in Italy before?</FieldLabel>
          <select
            value={form.livedInItalyBefore}
            onChange={(e) => update({ livedInItalyBefore: e.target.value })}
            className="w-full h-10 px-3 text-sm border border-[var(--domus-grey)]/50 bg-transparent text-[var(--domus-charcoal)] focus:outline-none focus:border-[var(--domus-gold)]"
          >
            <option value="">Select…</option>
            <option>No, this will be our first time</option>
            <option>Yes, briefly (less than 1 year)</option>
            <option>Yes, for 1–5 years</option>
            <option>Yes, for more than 5 years</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>Other countries you have lived in</FieldLabel>
          <Input value={form.previousCountries} onChange={(e) => update({ previousCountries: e.target.value })} placeholder="e.g. Singapore, Hong Kong, Dubai" className="intake-input" />
        </div>
      </div>
    </div>
  );
}

// ─── Section 3: Housing ───────────────────────────────────────────────────────
function Section3({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-6">
      <SectionTitle number="03" title="Housing" subtitle="Your home in Italy is the foundation of everything. Help us understand what you need — and what you dream of." />

      <div className="space-y-2">
        <FieldLabel>Are you looking to rent or buy?</FieldLabel>
        <MultiSelect
          options={["Rent initially, buy later", "Rent only", "Buy immediately", "Undecided"]}
          value={form.rentOrBuy}
          onChange={(v) => update({ rentOrBuy: v })}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel>Monthly rental budget (or purchase budget)</FieldLabel>
        <MultiSelect
          options={["€2,000–€3,500/month", "€3,500–€6,000/month", "€6,000–€10,000/month", "€10,000+/month", "Purchase: up to €500k", "Purchase: €500k–€1M", "Purchase: €1M–€3M", "Purchase: €3M+"]}
          value={form.budget}
          onChange={(v) => update({ budget: v })}
          max={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <FieldLabel optional>Bedrooms required</FieldLabel>
          <select
            value={form.bedrooms}
            onChange={(e) => update({ bedrooms: e.target.value })}
            className="w-full h-10 px-3 text-sm border border-[var(--domus-grey)]/50 bg-transparent text-[var(--domus-charcoal)] focus:outline-none focus:border-[var(--domus-gold)]"
          >
            <option value="">Select…</option>
            {["1","2","3","4","5","6+"].map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>Property type preference</FieldLabel>
          <select
            value={form.propertyType}
            onChange={(e) => update({ propertyType: e.target.value })}
            className="w-full h-10 px-3 text-sm border border-[var(--domus-grey)]/50 bg-transparent text-[var(--domus-charcoal)] focus:outline-none focus:border-[var(--domus-gold)]"
          >
            <option value="">Select…</option>
            <option>Apartment in a palazzo</option>
            <option>Modern apartment</option>
            <option>Townhouse / villa</option>
            <option>Penthouse</option>
            <option>No preference</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel optional>Non-negotiable requirements</FieldLabel>
        <MultiSelect
          options={["Outdoor space / terrace", "Parking / garage", "Lift", "Concierge / portiere", "Pet-friendly", "Home office space", "Near international school", "Near metro / transport", "Quiet / low traffic", "High ceilings / period features"]}
          value={form.propertyRequirements}
          onChange={(v) => update({ propertyRequirements: v })}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel optional>Neighbourhood vibe</FieldLabel>
        <MultiSelect
          options={["Historic / elegant", "Vibrant / social", "Quiet / residential", "Near parks / green space", "Walkable to restaurants & cafes", "Near international community", "Near good schools"]}
          value={form.neighbourhoodVibe}
          onChange={(v) => update({ neighbourhoodVibe: v })}
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>Neighbourhoods you have already researched or heard of</FieldLabel>
        <Input value={form.neighbourhoodInterest} onChange={(e) => update({ neighbourhoodInterest: e.target.value })} placeholder="e.g. Brera, Navigli, Parioli…" className="intake-input" />
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>Tell us about your current home — what do you love about it?</FieldLabel>
        <Textarea value={form.previousHomeNotes} onChange={(e) => update({ previousHomeNotes: e.target.value })} placeholder="This helps us find something that feels like home…" rows={3} className="intake-input resize-none" />
      </div>
    </div>
  );
}

// ─── Section 4: Education ─────────────────────────────────────────────────────
function Section4({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  const updateEduProfile = (i: number, patch: Partial<ChildEduProfile>) => {
    const profiles = [...form.childEduProfiles];
    profiles[i] = { ...profiles[i], ...patch };
    update({ childEduProfiles: profiles });
  };

  // Sync edu profiles with children list
  const syncedProfiles = form.children.map((child, i) => {
    return form.childEduProfiles[i] || defaultEduProfile(child.name);
  });

  return (
    <div className="space-y-6">
      <SectionTitle number="04" title="Education" subtitle="School placement in Italy requires careful planning. The more detail you share, the better we can match each child to the right environment." />

      {form.children.map((child, i) => (
        <div key={i} className="border border-[var(--domus-gold)]/20 p-5 space-y-4">
          <p className="text-xs tracking-widest uppercase text-[var(--domus-gold)]">{child.name || `Child ${i + 1}`}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <FieldLabel optional>Academic strengths or areas of interest</FieldLabel>
              <Input
                value={syncedProfiles[i]?.academicStrengths || ""}
                onChange={(e) => updateEduProfile(i, { childName: child.name, academicStrengths: e.target.value })}
                placeholder="e.g. Sciences, languages, arts"
                className="intake-input"
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel optional>Extracurricular activities</FieldLabel>
              <Input
                value={syncedProfiles[i]?.extracurriculars || ""}
                onChange={(e) => updateEduProfile(i, { childName: child.name, extracurriculars: e.target.value })}
                placeholder="e.g. Football, piano, swimming"
                className="intake-input"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel optional>Is curriculum continuity essential for this child?</FieldLabel>
              <select
                value={syncedProfiles[i]?.continuityEssential || ""}
                onChange={(e) => updateEduProfile(i, { childName: child.name, continuityEssential: e.target.value })}
                className="w-full h-10 px-3 text-sm border border-[var(--domus-grey)]/50 bg-transparent text-[var(--domus-charcoal)] focus:outline-none focus:border-[var(--domus-gold)]"
              >
                <option value="">Select…</option>
                <option>Yes — must continue same curriculum (IB, British, French, etc.)</option>
                <option>Preferred but flexible</option>
                <option>Open to a different curriculum</option>
                <option>Considering Italian state school</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      <Divider />

      <div className="space-y-2">
        <FieldLabel optional>How important is Italian language immersion?</FieldLabel>
        <ScaleInput
          value={form.italianImmersionScale}
          onChange={(v) => update({ italianImmersionScale: v })}
          labels={["Not important — international only", "Essential — full Italian integration"]}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel optional>Curriculum preference</FieldLabel>
        <MultiSelect
          options={["IB (International Baccalaureate)", "British (IGCSE / A-Level)", "French (AEFE)", "American", "Montessori", "Italian state", "No preference"]}
          value={form.curriculumPreference}
          onChange={(v) => update({ curriculumPreference: v })}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel optional>Mid-year entry</FieldLabel>
        <MultiSelect
          options={["Yes, we need mid-year entry", "No, we can wait for September", "Flexible"]}
          value={form.midYearEntry}
          onChange={(v) => update({ midYearEntry: v })}
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>Any learning needs, support requirements, or health considerations relevant to schooling?</FieldLabel>
        <Textarea
          value={form.learningNeeds}
          onChange={(e) => update({ learningNeeds: e.target.value })}
          placeholder="This is treated with complete confidentiality…"
          rows={3}
          className="intake-input resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>University targets (if relevant)</FieldLabel>
        <Input value={form.universityTarget} onChange={(e) => update({ universityTarget: e.target.value })} placeholder="e.g. UK Russell Group, Ivy League, Italian universities" className="intake-input" />
      </div>
    </div>
  );
}

// ─── Section 5: Professional & Fiscal ────────────────────────────────────────
function Section5({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  const hasPartner = form.whoRelocating.includes("Partner / Spouse");
  return (
    <div className="space-y-6">
      <SectionTitle number="05" title="Professional & Fiscal" subtitle="Italy's tax regime offers significant advantages for qualifying newcomers. Understanding your situation allows us to connect you with the right specialists from day one." />

      <div className="space-y-2">
        <FieldLabel optional>Your professional situation in Italy</FieldLabel>
        <MultiSelect
          options={["Employed by an Italian company", "Employed by a foreign company (remote)", "Self-employed / freelance", "Entrepreneur / business owner", "Investor / passive income", "Not working", "Retired"]}
          value={form.professionalSituation}
          onChange={(v) => update({ professionalSituation: v })}
        />
      </div>

      {hasPartner && (
        <div className="space-y-2">
          <FieldLabel optional>Partner's professional situation in Italy</FieldLabel>
          <MultiSelect
            options={["Employed by an Italian company", "Employed by a foreign company (remote)", "Self-employed / freelance", "Entrepreneur / business owner", "Investor / passive income", "Not working", "Retired"]}
            value={form.partnerProfSituation}
            onChange={(v) => update({ partnerProfSituation: v })}
          />
        </div>
      )}

      <Divider />

      <div className="space-y-2">
        <FieldLabel optional>Are you interested in Italy's Flat Tax regime (€100,000/year on foreign income)?</FieldLabel>
        <MultiSelect
          options={["Yes, actively exploring", "Yes, want to understand if I qualify", "Not sure — need guidance", "No, not relevant to my situation"]}
          value={form.flatTaxInterest}
          onChange={(v) => update({ flatTaxInterest: v })}
          max={1}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel optional>Have you been resident in Italy in the last 9 years?</FieldLabel>
        <MultiSelect
          options={["No", "Yes — briefly", "Yes — for more than 183 days in any year"]}
          value={form.livedInItalyLast9}
          onChange={(v) => update({ livedInItalyLast9: v })}
          max={1}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel optional>Do you already have an Italian commercialista (accountant)?</FieldLabel>
        <MultiSelect
          options={["Yes", "No — we will need one", "No — but we have international advisors"]}
          value={form.hasCommercialista}
          onChange={(v) => update({ hasCommercialista: v })}
          max={1}
        />
      </div>

      <div className="space-y-2">
        <FieldLabel optional>Banking needs</FieldLabel>
        <MultiSelect
          options={["Need to open an Italian bank account", "Need private banking / wealth management", "Need multi-currency account", "Already have Italian banking"]}
          value={form.bankingNeeds}
          onChange={(v) => update({ bankingNeeds: v })}
        />
      </div>
    </div>
  );
}

// ─── Section 6: Lifestyle & Integration ──────────────────────────────────────
function Section6({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  const hasPartner = form.whoRelocating.includes("Partner / Spouse");
  return (
    <div className="space-y-6">
      <SectionTitle number="06" title="Lifestyle & Integration" subtitle="Italy is not just a place to live — it is a way of life. Understanding how you want to live helps us build the right foundations." />

      <div className="space-y-2">
        <FieldLabel optional>How would you describe your lifestyle? (select all that apply)</FieldLabel>
        <MultiSelect
          options={["Active / outdoors", "Cultural / arts", "Social / entertaining", "Family-centred", "Quiet / private", "Foodie / culinary", "Fashion-conscious", "Business-focused", "Spiritual / wellness", "Academic / intellectual"]}
          value={form.lifestyleDescriptors}
          onChange={(v) => update({ lifestyleDescriptors: v })}
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>Hobbies and interests</FieldLabel>
        <Input value={form.hobbies} onChange={(e) => update({ hobbies: e.target.value })} placeholder="e.g. Cycling, opera, sailing, wine, yoga…" className="intake-input" />
      </div>

      <div className="space-y-2">
        <FieldLabel optional>How important is building a social network in Italy?</FieldLabel>
        <ScaleInput
          value={form.socialNetworkScale}
          onChange={(v) => update({ socialNetworkScale: v })}
          labels={["Not a priority", "Essential — we want to integrate deeply"]}
        />
      </div>

      <Divider />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <FieldLabel optional>Your Italian level</FieldLabel>
          <select
            value={form.italianLevelYou}
            onChange={(e) => update({ italianLevelYou: e.target.value })}
            className="w-full h-10 px-3 text-sm border border-[var(--domus-grey)]/50 bg-transparent text-[var(--domus-charcoal)] focus:outline-none focus:border-[var(--domus-gold)]"
          >
            <option value="">Select…</option>
            <option>None — starting from zero</option>
            <option>Beginner (A1–A2)</option>
            <option>Intermediate (B1–B2)</option>
            <option>Advanced (C1–C2)</option>
            <option>Native / near-native</option>
          </select>
        </div>
        {hasPartner && (
          <div className="space-y-1.5">
            <FieldLabel optional>Partner's Italian level</FieldLabel>
            <select
              value={form.italianLevelPartner}
              onChange={(e) => update({ italianLevelPartner: e.target.value })}
              className="w-full h-10 px-3 text-sm border border-[var(--domus-grey)]/50 bg-transparent text-[var(--domus-charcoal)] focus:outline-none focus:border-[var(--domus-gold)]"
            >
              <option value="">Select…</option>
              <option>None — starting from zero</option>
              <option>Beginner (A1–A2)</option>
              <option>Intermediate (B1–B2)</option>
              <option>Advanced (C1–C2)</option>
              <option>Native / near-native</option>
            </select>
          </div>
        )}
      </div>

      <Divider />

      <div className="space-y-2">
        <FieldLabel optional>Healthcare needs</FieldLabel>
        <MultiSelect
          options={["Private health insurance required", "Need English-speaking GP", "Need specialist / ongoing care", "Paediatric care", "Mental health support", "Dental", "No specific needs"]}
          value={form.healthcareNeeds}
          onChange={(v) => update({ healthcareNeeds: v })}
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>Any specific health considerations we should be aware of?</FieldLabel>
        <Textarea
          value={form.healthcareOther}
          onChange={(e) => update({ healthcareOther: e.target.value })}
          placeholder="Treated with complete confidentiality…"
          rows={2}
          className="intake-input resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>Dietary requirements or preferences</FieldLabel>
        <Input value={form.dietaryNotes} onChange={(e) => update({ dietaryNotes: e.target.value })} placeholder="e.g. Halal, kosher, vegan, severe allergies…" className="intake-input" />
      </div>
    </div>
  );
}

// ─── Section 7: Priorities & Anxieties ───────────────────────────────────────
function Section7({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-6">
      <SectionTitle number="07" title="Priorities & Anxieties" subtitle="The most important section. Tell us what matters most — and what worries you. This is where we begin to truly understand your family." />

      <div className="space-y-2">
        <FieldLabel>Your top three priorities for this relocation (select up to 3)</FieldLabel>
        <MultiSelect
          options={["Finding the right home quickly", "School placement", "Fiscal / tax planning", "Building a social life", "Learning Italian", "Healthcare access", "Smooth bureaucratic process", "Partner's career / work permit", "Feeling safe and settled", "Maintaining quality of life"]}
          value={form.topPriorities}
          onChange={(v) => update({ topPriorities: v })}
          max={3}
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>What is your biggest anxiety about this move?</FieldLabel>
        <Textarea
          value={form.biggestAnxiety}
          onChange={(e) => update({ biggestAnxiety: e.target.value })}
          placeholder="There are no wrong answers here. The more honest you are, the better we can help…"
          rows={3}
          className="intake-input resize-none"
        />
      </div>

      <Divider />

      <div className="space-y-2">
        <FieldLabel optional>How would you rate your previous relocation experience?</FieldLabel>
        <ScaleInput
          value={form.prevReloScale}
          onChange={(v) => update({ prevReloScale: v })}
          labels={["Very difficult / traumatic", "Smooth and well-supported"]}
        />
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>If a previous relocation was difficult, what went wrong?</FieldLabel>
        <Textarea
          value={form.prevReloWentWrong}
          onChange={(e) => update({ prevReloWentWrong: e.target.value })}
          placeholder="This helps us ensure we do not repeat the same mistakes…"
          rows={2}
          className="intake-input resize-none"
        />
      </div>

      <Divider />

      <div className="space-y-2">
        <FieldLabel>Preferred communication method</FieldLabel>
        <MultiSelect
          options={["Email", "WhatsApp", "Phone call", "Video call", "In-person meeting"]}
          value={form.commsPref}
          onChange={(v) => update({ commsPref: v })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <FieldLabel optional>Your current timezone</FieldLabel>
          <Input value={form.timezone} onChange={(e) => update({ timezone: e.target.value })} placeholder="e.g. GMT+8, EST, CET" className="intake-input" />
        </div>
        <div className="space-y-1.5">
          <FieldLabel optional>Additional decision-maker to include in communications</FieldLabel>
          <Input value={form.additionalDecisionMaker} onChange={(e) => update({ additionalDecisionMaker: e.target.value })} placeholder="Name and email" className="intake-input" />
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel optional>Is there anything else you would like us to know?</FieldLabel>
        <Textarea
          value={form.anythingElse}
          onChange={(e) => update({ anythingElse: e.target.value })}
          placeholder="Anything at all — family dynamics, timing pressures, specific concerns…"
          rows={3}
          className="intake-input resize-none"
        />
      </div>

      <div className="space-y-2">
        <FieldLabel optional>How did you hear about DOMUS?</FieldLabel>
        <MultiSelect
          options={["Personal referral", "Google search", "Social media", "Press / editorial", "Event or conference", "LinkedIn", "Other"]}
          value={form.heardAboutDomus}
          onChange={(v) => update({ heardAboutDomus: v })}
        />
      </div>
    </div>
  );
}

// ─── Confirmation Screen ──────────────────────────────────────────────────────
function ConfirmationScreen({
  firstName,
  lang,
  emailExists,
  submittedEmail,
  intakeId,
}: {
  firstName: string;
  lang: string;
  emailExists: boolean;
  submittedEmail: string;
  intakeId: number;
}) {
  const encodedEmail = encodeURIComponent(submittedEmail);
  const signupUrl = `/signup?email=${encodedEmail}&intakeId=${intakeId}`;
  const loginUrl = `/login?email=${encodedEmail}&intakeId=${intakeId}`;

  // Multilingual body copy (email-agnostic — preview is on the dashboard)
  const messages: Record<string, { heading: string; body: string }> = {
    Italian: {
      heading: "Grazie, " + firstName,
      body: "Il vostro questionario è stato ricevuto. Il vostro consulente DOMUS vi contatterà entro 24 ore. Abbiamo già iniziato a lavorare per voi.",
    },
    French: {
      heading: "Merci, " + firstName,
      body: "Votre questionnaire a été reçu. Votre conseiller DOMUS vous contactera dans les 24 heures. Nous travaillons déjà pour vous.",
    },
    German: {
      heading: "Danke, " + firstName,
      body: "Ihr Fragebogen ist eingegangen. Ihr DOMUS-Berater wird sich innerhalb von 24 Stunden bei Ihnen melden.",
    },
    Japanese: {
      heading: firstName + " 様、ありがとうございます",
      body: "アンケートを受け取りました。DOMusのアドバイザーが24時間以内にご連絡いたします。",
    },
    Mandarin: {
      heading: firstName + "，谢谢您",
      body: "您的问卷已收到。您的DOMUS顾问将在24小时内与您联系。我们已经开始为您工作了。",
    },
  };

  const msg = messages[lang] || {
    heading: `Thank you, ${firstName}`,
    body: "Your questionnaire has been received. Your DOMUS advisor will be in touch within 24 hours. We have already begun working for you.",
  };

  return (
    <div className="min-h-screen bg-[var(--domus-ivory)] flex items-center justify-center px-6">
      <div className="max-w-lg text-center space-y-8">
        <div className="flex justify-center">
          <DomusCrest size={160} />
        </div>
        <div className="w-12 h-12 rounded-full bg-[var(--domus-gold)] flex items-center justify-center mx-auto">
          <Check size={24} className="text-[var(--domus-charcoal)]" />
        </div>
        <div className="space-y-4">
          <h1 className="font-['Cormorant_Garamond'] text-4xl text-[var(--domus-charcoal)] font-light">{msg.heading}</h1>
          <p className="text-[var(--domus-charcoal)] leading-relaxed">{msg.body}</p>
        </div>

        {/* Milan Preview CTA — adapts based on whether the client already has an account */}
        <div className="border border-[var(--domus-gold)]/30 p-8 space-y-5 bg-white/60">
          <p className="font-['Cormorant_Garamond'] text-2xl text-[var(--domus-charcoal)] font-light italic leading-snug">
            Sign up or log in to see your DOMUS AI Pre-Relocation Intelligence Brief
          </p>
          {emailExists ? (
            <>
              <p className="text-sm text-[var(--domus-grey)] leading-relaxed">
                Welcome back — your Milan Preview is waiting in your dashboard.
              </p>
              <a
                href={loginUrl}
                className="inline-block px-8 py-3 bg-[var(--domus-charcoal)] text-[var(--domus-ivory)] text-xs tracking-widest uppercase hover:bg-[var(--domus-gold)] hover:text-[var(--domus-charcoal)] transition-colors"
              >
                Log in to read your brief →
              </a>
            </>
          ) : (
            <>
              <p className="text-sm text-[var(--domus-grey)] leading-relaxed">
                Create your DOMUS account to access your personalised brief now.
              </p>
              <a
                href={signupUrl}
                className="inline-block px-8 py-3 bg-[var(--domus-charcoal)] text-[var(--domus-ivory)] text-xs tracking-widest uppercase hover:bg-[var(--domus-gold)] hover:text-[var(--domus-charcoal)] transition-colors"
              >
                Create your account →
              </a>
            </>
          )}
        </div>

        <div className="border-t border-[var(--domus-gold)]/30 pt-6">
          <Link href="/" className="text-xs tracking-widest uppercase text-[var(--domus-gold)] hover:text-[var(--domus-charcoal)] transition-colors">
            ← Return to DOMUS
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validateSection(section: number, form: FormData): string | null {
  if (section === 1) {
    if (!form.primaryName.trim()) return "Please enter your full name.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email address.";
    if (form.whoRelocating.length === 0) return "Please select who is relocating.";
  }
  if (section === 2) {
    if (!form.fromCity.trim()) return "Please enter your current city.";
    if (form.moveReasons.length === 0) return "Please select at least one reason for moving.";
    if (form.targetCity.length === 0) return "Please select a target city.";
  }
  if (section === 3) {
    if (form.rentOrBuy.length === 0) return "Please select rent or buy preference.";
    if (form.budget.length === 0) return "Please select a budget range.";
  }
  if (section === 7) {
    if (form.commsPref.length === 0) return "Please select a preferred communication method.";
  }
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Intake() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [currentSection, setCurrentSection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ firstName: string; lang: string; emailExists: boolean; submittedEmail: string; intakeId: number } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const hasChildren = form.whoRelocating.includes("Children") && form.children.length > 0;
  const totalSections = hasChildren ? 7 : 6;
  // Section mapping: if no children, skip section 4 (Education)
  const sectionOrder = hasChildren ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 5, 6, 7];
  const currentSectionIndex = sectionOrder.indexOf(currentSection);
  const displayStep = currentSectionIndex + 1;

  const update = useCallback((patch: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const submitMutation = trpc.intake.submit.useMutation({
    onSuccess: (data) => {
      setSubmissionResult({
        firstName: data.firstName,
        lang: data.preferredLanguage,
        emailExists: data.emailExists,
        submittedEmail: data.submittedEmail,
        intakeId: data.id,
      });
      setSubmitted(true);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goNext = () => {
    const error = validateSection(currentSection, form);
    if (error) { toast.error(error); return; }
    const nextIdx = currentSectionIndex + 1;
    if (nextIdx < sectionOrder.length) {
      setCurrentSection(sectionOrder[nextIdx]);
      scrollToTop();
    }
  };

  const goPrev = () => {
    const prevIdx = currentSectionIndex - 1;
    if (prevIdx >= 0) {
      setCurrentSection(sectionOrder[prevIdx]);
      scrollToTop();
    }
  };

  const handleSubmit = () => {
    const error = validateSection(currentSection, form);
    if (error) { toast.error(error); return; }

    // Sync edu profiles with children before submitting
    const syncedEduProfiles = form.children.map((child, i) => {
      return form.childEduProfiles[i] || defaultEduProfile(child.name);
    });

    submitMutation.mutate({
      ...form,
      childEduProfiles: syncedEduProfiles,
      italianImmersionScale: form.italianImmersionScale || undefined,
      socialNetworkScale: form.socialNetworkScale || undefined,
      prevReloScale: form.prevReloScale || undefined,
    });
  };

  if (submitted && submissionResult) {
    return (
      <ConfirmationScreen
        firstName={submissionResult.firstName}
        lang={submissionResult.lang}
        emailExists={submissionResult.emailExists}
        submittedEmail={submissionResult.submittedEmail}
        intakeId={submissionResult.intakeId}
      />
    );
  }

  const sectionLabels = ["The Family", "The Move", "Housing", "Education", "Professional & Fiscal", "Lifestyle", "Priorities"];
  const sectionLabelMap: Record<number, string> = {
    1: "The Family", 2: "The Move", 3: "Housing", 4: "Education",
    5: "Professional & Fiscal", 6: "Lifestyle", 7: "Priorities",
  };

  return (
    <div className="min-h-screen bg-[var(--domus-ivory)]" ref={topRef}>
      {/* Header */}
      <header className="border-b border-[var(--domus-gold)]/20 bg-[var(--domus-ivory)] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src={DOMUS_LOGO_URL} alt="DOMUS Relocations" style={{ height: 64, width: "auto", objectFit: "contain" }} />
          </Link>
          <span className="text-xs tracking-widest uppercase text-[var(--domus-grey)]">Private Intake</span>
        </div>
        {/* Gold progress bar */}
        <div className="h-0.5 bg-[var(--domus-gold)]/15">
          <div
            className="h-full bg-[var(--domus-gold)] transition-all duration-500"
            style={{ width: `${(displayStep / totalSections) * 100}%` }}
          />
        </div>
      </header>

      {/* Step indicator */}
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs tracking-widest uppercase text-[var(--domus-gold)]">
            {sectionLabelMap[currentSection]}
          </p>
          <p className="text-xs text-[var(--domus-grey)]">{displayStep} of {totalSections}</p>
        </div>
        {/* Step dots */}
        <div className="flex gap-1.5">
          {sectionOrder.map((_, idx) => (
            <div
              key={idx}
              className={`h-0.5 flex-1 transition-all duration-300 ${
                idx < displayStep ? "bg-[var(--domus-gold)]" : "bg-[var(--domus-gold)]/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        <style>{`
          .intake-input {
            border-color: rgba(138, 128, 112, 0.4);
            background: transparent;
            border-radius: 0;
            font-size: 14px;
          }
          .intake-input:focus {
            border-color: var(--domus-gold);
            box-shadow: none;
            outline: none;
          }
          .intake-input::placeholder {
            color: rgba(138, 128, 112, 0.6);
          }
        `}</style>

        {currentSection === 1 && <Section1 form={form} update={update} />}
        {currentSection === 2 && <Section2 form={form} update={update} />}
        {currentSection === 3 && <Section3 form={form} update={update} />}
        {currentSection === 4 && <Section4 form={form} update={update} />}
        {currentSection === 5 && <Section5 form={form} update={update} />}
        {currentSection === 6 && <Section6 form={form} update={update} />}
        {currentSection === 7 && <Section7 form={form} update={update} />}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--domus-gold)]/20">
          <Button
            type="button"
            variant="ghost"
            onClick={goPrev}
            disabled={currentSectionIndex === 0}
            className="flex items-center gap-2 text-[var(--domus-grey)] hover:text-[var(--domus-charcoal)] disabled:opacity-0"
          >
            <ChevronLeft size={16} /> Previous
          </Button>

          {currentSectionIndex < sectionOrder.length - 1 ? (
            <Button
              type="button"
              onClick={goNext}
              className="flex items-center gap-2 bg-[var(--domus-charcoal)] text-[var(--domus-ivory)] hover:bg-[var(--domus-gold)] hover:text-[var(--domus-charcoal)] transition-colors px-8"
            >
              Continue <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="flex items-center gap-2 bg-[var(--domus-gold)] text-[var(--domus-charcoal)] hover:bg-[var(--domus-charcoal)] hover:text-[var(--domus-ivory)] transition-colors px-8 font-medium"
            >
              {submitMutation.isPending ? "Submitting…" : "Submit Questionnaire"}
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-[var(--domus-grey)] mt-6">
          All information is treated with complete confidentiality and shared only with your assigned DOMUS advisor.
        </p>
      </main>
    </div>
  );
}
