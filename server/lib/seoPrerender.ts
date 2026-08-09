/**
 * SEO Prerender — per-route HTML injection for crawlers.
 *
 * When a non-JS crawler (GPTBot, ClaudeBot, Googlebot, Bingbot, etc.) requests
 * a page, it receives the SPA shell with an empty <div id="root">. This module
 * enriches the HTML response with route-specific <title>, <meta>, <h1>, and
 * visible body copy so crawlers index real content.
 */

interface RouteContent {
  title: string;
  description: string;
  canonical: string;
  bodyHtml: string;
}

const BASE = "https://www.domusrelocations.com";

const ROUTES: Record<string, RouteContent> = {
  "/": {
    title: "DOMUS Relocations: Premium Milan Relocation Services",
    description: "A discreet relocation partner for internationally mobile clients. Private advisory, school placement, and trusted network access for families moving to Milan.",
    canonical: `${BASE}/`,
    bodyHtml: `<h1>Your Life in Milan, Curated Before You Arrive.</h1><p>A discreet relocation partner for internationally mobile clients. Private advisory, school placement, and trusted network access for families moving to Milan.</p><h2>DOMUS Compass AI Pre-Moving Intelligence Brief</h2><p>The first AI-powered pre-moving intelligence brief in private relocation. Before your first advisor call, our AI analyses your profile in depth and generates a personalised intelligence document mapping your risks, fiscal deadlines, school admission windows, neighbourhood fit, and a 30/60/90-day integration roadmap.</p><h2>DOMUS Meridian Corporate Relocation</h2><p>A dedicated B2B platform for HR and global mobility teams managing employee relocations to Italy.</p><h2>Our Services</h2><ul><li>Private Relocation Advisory</li><li>School Placement Milan</li><li>Property Search and Housing Advisory</li><li>Tax and Residency Advisory</li><li>Ongoing Concierge and Network Access</li><li>University Student Relocation Milan</li></ul><h2>International Students</h2><p>DOMUS Relocations helps international students moving to Milan for Bocconi University, Politecnico di Milano, IED, Naba, Cattolica, and other leading institutions.</p><p>Email: milano@domusrelocations.com</p>`,
  },
  "/international-students": {
    title: "International Student Relocation Milan | DOMUS Relocations",
    description: "DOMUS Relocations helps international students move to Milan for Bocconi, Politecnico, IED, Naba and other universities. Housing, visa support, contract review, and settling-in handled before you arrive.",
    canonical: `${BASE}/international-students`,
    bodyHtml: `<h1>Milan, handled before you arrive.</h1><p>Bocconi. Politecnico di Milano. IED. Naba. Cattolica. Every year, thousands of international students arrive in Milan for world-class education and face the same avoidable problems: wrong housing, wrong contracts, wrong neighbourhood, wrong visa process. DOMUS Relocations solves all of it, before your first day of term.</p><h2>How DOMUS helps international students</h2><ul><li>Visa and permit advisory including codice fiscale and permesso di soggiorno</li><li>Housing search curated to budget and campus proximity</li><li>Contract review and protection before signing</li><li>Neighbourhood advisory near Bocconi, Politecnico, IED, or Naba</li><li>Arrival and setup including bank account, SIM, utilities, and GP registration</li><li>Social integration and community introductions</li></ul><h2>Universities we support</h2><p>Bocconi University, Politecnico di Milano, IED, Naba, Universita Cattolica del Sacro Cuore, and other Milan institutions.</p><p>Email: milano@domusrelocations.com</p>`,
  },
  "/services": {
    title: "Private Relocation Services Milan | DOMUS Relocations",
    description: "DOMUS Relocations offers private relocation advisory, school placement, property search, tax and residency advisory, and the DOMUS Compass AI Intelligence Brief for families and executives moving to Milan.",
    canonical: `${BASE}/services`,
    bodyHtml: `<h1>Every detail of your move to Milan, handled.</h1><p>From the first conversation to the first months settled in Milan, DOMUS Relocations provides a complete private relocation service for internationally mobile families and executives. Five core services. One point of contact. No detail left to chance.</p><h2>I Private Relocation Advisory</h2><p>A strategy as unique as your family. Personalised relocation strategy, neighbourhood selection guidance, coordination with curated real estate agents, and personal support during your first months in Milan.</p><h2>II School Advisory</h2><p>The right school, chosen with certainty. Assessment of family needs, introductions to selected international schools, guidance through application and admission, and insider student conversations.</p><h2>III Milan Integration</h2><p>Become part of the city, not just a resident. Introductions to international communities, exclusive clubs, sports facilities, cultural institutions, and trusted lifestyle services.</p><h2>IV Trusted Network Access</h2><p>Vetted medical and legal professionals, architects, interior designers, and private household and lifestyle services.</p><h2>V DOMUS Compass AI Intelligence Brief</h2><p>Included with every DOMUS engagement. AI analysis of your full family and lifestyle profile, risk mapping including fiscal deadlines and permit timelines, personalised 30/60/90-day Milan integration roadmap. No other relocation brand does this.</p><p>Email: milano@domusrelocations.com</p>`,
  },
  "/corporate": {
    title: "Corporate Relocation Italy | DOMUS Meridian",
    description: "DOMUS Meridian is a dedicated corporate relocation platform for HR and global mobility teams managing employee relocations to Italy.",
    canonical: `${BASE}/corporate`,
    bodyHtml: `<h1>DOMUS Meridian Corporate Relocation to Italy</h1><p>A dedicated B2B platform for HR directors and global mobility teams managing employee relocations to Italy. Transparent cost estimation, assignment tracking, and direct access to DOMUS advisory services.</p><p>Email: milano@domusrelocations.com</p>`,
  },
};

export function injectSeoContent(html: string, pathname: string): string {
  const path = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const route = ROUTES[path];
  if (!route) return html;

  let result = html;

  result = result.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`);
  result = result.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/,`$1${escapeHtml(route.description)}$2`);
  result = result.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/,`$1${route.canonical}$2`);
  result = result.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/,`$1${escapeHtml(route.title)}$2`);
  result = result.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/,`$1${escapeHtml(route.description)}$2`);
  result = result.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/,`$1${route.canonical}$2`);

  const seoBlock = `<noscript><div style="display:none" aria-hidden="true">${route.bodyHtml}</div></noscript>`;
  result = result.replace('<div id="root"></div>', `<div id="root"></div>${seoBlock}`);

  return result;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
