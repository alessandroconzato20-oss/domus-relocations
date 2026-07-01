/**
 * DOMUS Relocations — Intake Prompt Builders
 *
 * Dynamically constructs the user prompts for both AI calls from the intake form data.
 * To add a new question: add it to the schema, add it here, and add it to aiPrompts.ts context.
 */

import type { IntakeForm } from "../../drizzle/schema";

type Child = {
  name: string;
  dateOfBirth: string;
  currentSchool: string;
  currentCurriculum: string;
  yearGrade: string;
  languagesSpoken: string;
};

type ChildEduProfile = {
  childName: string;
  academicStrengths: string;
  extracurriculars: string;
  continuityEssential: string;
};

function ageFromDOB(dob: string): string {
  if (!dob) return "unknown age";
  const birth = new Date(dob);
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear();
  return `${age} years old`;
}

function arr(val: string[] | null | undefined): string {
  if (!val || val.length === 0) return "not specified";
  return val.join(", ");
}

function str(val: string | null | undefined): string {
  return val?.trim() || "not specified";
}

function num(val: number | null | undefined): string {
  return val != null ? String(val) : "not specified";
}

function buildChildrenSection(
  children: Child[] | null | undefined,
  eduProfiles: ChildEduProfile[] | null | undefined
): string {
  if (!children || children.length === 0) return "No children relocating.";

  return children
    .map((child, i) => {
      const edu = eduProfiles?.find((e) => e.childName === child.name) || eduProfiles?.[i];
      return [
        `Child: ${child.name}`,
        `  Age: ${ageFromDOB(child.dateOfBirth)}`,
        `  Current school: ${str(child.currentSchool)}`,
        `  Curriculum: ${str(child.currentCurriculum)}`,
        `  Year/Grade: ${str(child.yearGrade)}`,
        `  Languages spoken: ${str(child.languagesSpoken)}`,
        edu
          ? [
              `  Academic strengths/needs: ${str(edu.academicStrengths)}`,
              `  Extracurriculars: ${str(edu.extracurriculars)}`,
              `  Curriculum continuity essential: ${str(edu.continuityEssential)}`,
            ].join("\n")
          : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

export function buildAdvisorBriefUserPrompt(form: IntakeForm): string {
  const children = form.children as Child[] | null;
  const eduProfiles = form.childEduProfiles as ChildEduProfile[] | null;

  return `Generate an Advisor Brief for the following prospective DOMUS client family.

FAMILY OVERVIEW
Primary contact: ${str(form.primaryName)}
Who is relocating: ${arr(form.whoRelocating as string[])}
Partner name and nationality: ${str(form.partnerName)}, ${str(form.partnerNationality)}
Partner languages: ${str(form.partnerLanguages)}
Partner professional situation in Italy: ${arr(form.partnerProfSituation as string[])}
Children:
${buildChildrenSection(children, eduProfiles)}
Pets: ${arr(form.pets as string[])}
Preferred communication: ${arr(form.commsPref as string[])}, timezone ${str(form.timezone)}
Additional decision-maker to copy: ${str(form.additionalDecisionMaker)}

THE MOVE
Moving from: ${str(form.fromCity)}
Nationalities: ${str(form.nationalities)}
Reason for move: ${arr(form.moveReasons as string[])}
Target arrival: ${str(form.arrivalDate)} (${str(form.dateFirmness)})
Intended duration: ${arr(form.intendedDuration as string[])}
Target city: ${arr(form.targetCity as string[])}
Lived in Italy before: ${str(form.livedInItalyBefore)}
Previous countries lived in: ${str(form.previousCountries)}

HOUSING
Renting or buying: ${arr(form.rentOrBuy as string[])}
Budget: ${arr(form.budget as string[])}
Bedrooms: ${str(form.bedrooms)}, Property type: ${str(form.propertyType)}
Non-negotiables: ${arr(form.propertyRequirements as string[])}
Neighbourhood vibe: ${arr(form.neighbourhoodVibe as string[])}
Neighbourhoods researched: ${str(form.neighbourhoodInterest)}
Notes on previous home: ${str(form.previousHomeNotes)}

EDUCATION
${buildChildrenSection(children, eduProfiles)}
Italian immersion importance: ${num(form.italianImmersionScale)}/5
Curriculum preference: ${arr(form.curriculumPreference as string[])}
Mid-year entry: ${arr(form.midYearEntry as string[])}
Learning needs (confidential): ${str(form.learningNeeds)}
University targets: ${str(form.universityTarget)}

PROFESSIONAL & FISCAL
Professional situation: ${arr(form.professionalSituation as string[])}
Flat tax interest: ${arr(form.flatTaxInterest as string[])}
Lived in Italy last 9 years: ${arr(form.livedInItalyLast9 as string[])}
Has commercialista: ${arr(form.hasCommercialista as string[])}
Banking needs: ${arr(form.bankingNeeds as string[])}

LIFESTYLE & HEALTH
Lifestyle descriptors: ${arr(form.lifestyleDescriptors as string[])}
Hobbies: ${str(form.hobbies)}
Social network importance: ${num(form.socialNetworkScale)}/5
Italian level (primary): ${str(form.italianLevelYou)}
Italian level (partner): ${str(form.italianLevelPartner)}
Healthcare needs: ${arr(form.healthcareNeeds as string[])}
Health notes (confidential): ${str(form.healthcareOther)}
Dietary notes: ${str(form.dietaryNotes)}

PRIORITIES & PSYCHOLOGY
Top priorities: ${arr(form.topPriorities as string[])}
Biggest anxiety: ${str(form.biggestAnxiety)}
Previous relocation experience: ${num(form.prevReloScale)}/5
What went wrong before: ${str(form.prevReloWentWrong)}
Anything else: ${str(form.anythingElse)}`;
}

export function buildClientPreviewUserPrompt(form: IntakeForm): string {
  const children = form.children as Child[] | null;
  const eduProfiles = form.childEduProfiles as ChildEduProfile[] | null;
  const firstName = str(form.primaryName).split(" ")[0];

  // Language instruction
  const lang = str(form.preferredLanguage);
  const langInstruction =
    lang !== "English" && lang !== "not specified"
      ? `\n\nIMPORTANT: Write the ENTIRE document in ${lang}. Do not include any English text.`
      : "";

  return `Generate a personalised Milan Preview document for the following client family.${langInstruction}

FAMILY
Primary contact: ${str(form.primaryName)} (first name: ${firstName})
Who is relocating: ${arr(form.whoRelocating as string[])}
Partner name: ${str(form.partnerName)}
Children:
${buildChildrenSection(children, eduProfiles)}
Pets: ${arr(form.pets as string[])}

THE MOVE
Moving from: ${str(form.fromCity)}
Reason for move: ${arr(form.moveReasons as string[])}
Target arrival: ${str(form.arrivalDate)} (${str(form.dateFirmness)})
Target city: ${arr(form.targetCity as string[])}
Lived in Italy before: ${str(form.livedInItalyBefore)}
Previous countries: ${str(form.previousCountries)}

HOUSING PREFERENCES
Renting or buying: ${arr(form.rentOrBuy as string[])}
Budget: ${arr(form.budget as string[])}
Bedrooms: ${str(form.bedrooms)}, Type: ${str(form.propertyType)}
Non-negotiables: ${arr(form.propertyRequirements as string[])}
Neighbourhood vibe: ${arr(form.neighbourhoodVibe as string[])}
Neighbourhoods researched: ${str(form.neighbourhoodInterest)}
Notes on previous home: ${str(form.previousHomeNotes)}

EDUCATION (children only — no confidential health/learning data)
Italian immersion importance: ${num(form.italianImmersionScale)}/5
Curriculum preference: ${arr(form.curriculumPreference as string[])}

LIFESTYLE
Lifestyle descriptors: ${arr(form.lifestyleDescriptors as string[])}
Hobbies: ${str(form.hobbies)}
Social network importance: ${num(form.socialNetworkScale)}/5
Italian level: ${str(form.italianLevelYou)}
Dietary notes: ${str(form.dietaryNotes)}

PRIORITIES
Top priorities: ${arr(form.topPriorities as string[])}
Biggest anxiety: ${str(form.biggestAnxiety)}
Anything else: ${str(form.anythingElse)}`;
}
