/**
 * DOMUS Relocations — PDF Generator
 *
 * Uses @sparticuz/chromium + puppeteer-core for serverless-compatible PDF generation.
 * Both PDFs are generated from styled HTML templates matching the DOMUS visual identity.
 */

import puppeteerCore from "puppeteer-core";

// Lazy-load chromium to avoid startup cost when not generating PDFs
async function getBrowser() {
  let executablePath: string;
  
  try {
    // Try @sparticuz/chromium first (serverless/production)
    const chromium = await import("@sparticuz/chromium");
    executablePath = await chromium.default.executablePath();
    return await puppeteerCore.launch({
      args: chromium.default.args,
      executablePath,
      headless: true,
    });
  } catch {
    // Fallback: use system chromium (local dev)
    return await puppeteerCore.launch({
      headless: true,
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }
}

export async function generatePDF(htmlContent: string): Promise<Buffer> {
  const browser = await getBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "18mm", bottom: "20mm", left: "18mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

// ─── DOMUS SVG Crest (inline) ────────────────────────────────────────────────
const DOMUS_CREST_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100" width="60" height="75">
  <path d="M40 5 L75 20 L75 55 C75 75 60 90 40 95 C20 90 5 75 5 55 L5 20 Z" fill="none" stroke="#B8962E" stroke-width="1.5"/>
  <text x="40" y="52" text-anchor="middle" font-family="Cambria, serif" font-size="18" fill="#1B2A4A" font-style="italic">D</text>
  <path d="M25 62 L55 62" stroke="#B8962E" stroke-width="0.8"/>
  <text x="40" y="75" text-anchor="middle" font-family="Cambria, serif" font-size="7" fill="#1B2A4A" letter-spacing="3">DOMUS</text>
</svg>`;

// ─── Advisor Brief HTML Template ─────────────────────────────────────────────
export function buildAdvisorBriefHTML(aiText: string, familyName: string, date: string): string {
  // Convert markdown-style headers to styled HTML
  const formattedContent = aiText
    .replace(/^#{1,3}\s*(.+)$/gm, '<h2 class="section-heading">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hul])/gm, "")
    // Wrap risk-related content
    .replace(
      /(RISK[^<]*(?:<\/p>|<\/li>|<\/h2>))/gi,
      '<div class="risk-flag">$1</div>'
    );

  // Parse sections for special rendering
  const sections = aiText.split(/\n(?=[A-Z][A-Z\s&]+\n)/);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Calibri:wght@400;600&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 11px;
    color: #111111;
    line-height: 1.6;
    background: #ffffff;
    position: relative;
  }
  
  /* Watermark */
  body::before {
    content: 'INTERNAL — NOT FOR CLIENT DISTRIBUTION';
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-35deg);
    font-size: 28px;
    color: rgba(0,0,0,0.055);
    white-space: nowrap;
    pointer-events: none;
    z-index: 0;
    font-family: Calibri, Arial, sans-serif;
    letter-spacing: 2px;
  }
  
  .header {
    background: #1B2A4A;
    padding: 18px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: -20mm -18mm 0 -18mm;
    padding: 16px 18mm;
  }
  
  .header-left h1 {
    color: #C9A84C;
    font-size: 16px;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 600;
  }
  
  .header-left p {
    color: rgba(255,255,255,0.85);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 3px;
  }
  
  .header-right {
    text-align: right;
  }
  
  .header-right .family-name {
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
  }
  
  .header-right .date {
    color: rgba(255,255,255,0.65);
    font-size: 9px;
    margin-top: 2px;
  }
  
  .content {
    position: relative;
    z-index: 1;
    padding-top: 20px;
  }
  
  h2.section-heading, .section-heading {
    color: #B8962E;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
    margin: 20px 0 8px 0;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(184,150,46,0.25);
  }
  
  p {
    margin-bottom: 8px;
    line-height: 1.65;
  }
  
  ul {
    margin: 6px 0 8px 16px;
  }
  
  li {
    margin-bottom: 4px;
  }
  
  .risk-box {
    border-left: 3px solid #8B1A1A;
    background: #FFF0F0;
    padding: 10px 14px;
    margin: 12px 0;
    border-radius: 0 4px 4px 0;
  }
  
  .risk-box-title {
    color: #8B1A1A;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 6px;
  }
  
  .neighbourhood-card {
    background: #1B2A4A;
    color: #ffffff;
    padding: 10px 14px;
    margin: 8px 0;
    border-radius: 3px;
  }
  
  .neighbourhood-card .name {
    color: #C9A84C;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
  }
  
  .neighbourhood-card .desc {
    font-size: 10px;
    color: rgba(255,255,255,0.85);
    margin-top: 4px;
    line-height: 1.5;
  }
  
  .footer {
    margin-top: 30px;
    padding-top: 10px;
    border-top: 1px solid rgba(0,0,0,0.12);
    font-size: 9px;
    color: #888888;
    text-align: center;
  }
  
  strong { font-weight: 600; }
</style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>DOMUS Relocations</h1>
      <p>Advisor Brief — Confidential</p>
    </div>
    <div class="header-right">
      <div class="family-name">${familyName}</div>
      <div class="date">Generated ${date}</div>
    </div>
  </div>
  
  <div class="content">
    ${renderAdvisorContent(aiText)}
  </div>
  
  <div class="footer">
    DOMUS Relocations &middot; Strictly confidential &middot; Generated ${date}
  </div>
</body>
</html>`;
}

function renderAdvisorContent(text: string): string {
  const lines = text.split("\n");
  let html = "";
  let inList = false;
  let inRiskBox = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inRiskBox) { html += "</div>"; inRiskBox = false; }
      continue;
    }

    // Section headings (ALL CAPS lines or markdown ##)
    if (/^#{1,3}\s/.test(trimmed)) {
      const heading = trimmed.replace(/^#{1,3}\s+/, "");
      if (inList) { html += "</ul>"; inList = false; }
      if (inRiskBox) { html += "</div>"; inRiskBox = false; }

      if (/risk/i.test(heading)) {
        html += `<div class="risk-box"><div class="risk-box-title">⚠ ${heading}</div>`;
        inRiskBox = true;
      } else if (/neighbourhood/i.test(heading)) {
        html += `<h2 class="section-heading">${heading}</h2>`;
      } else {
        html += `<h2 class="section-heading">${heading}</h2>`;
      }
      continue;
    }

    // Detect neighbourhood entries like "1. Brera —" or "**Brera**"
    if (/^\*\*[A-Z][^*]+\*\*/.test(trimmed) && /neighbourhood|brera|navigli|parioli|trastevere|porta|isola|city|centro|zona/i.test(trimmed + html.slice(-200))) {
      if (inList) { html += "</ul>"; inList = false; }
      const name = trimmed.replace(/\*\*/g, "").split("—")[0].split(":")[0].trim();
      const desc = trimmed.replace(/\*\*[^*]+\*\*/, "").replace(/^[\s—:]+/, "");
      html += `<div class="neighbourhood-card"><div class="name">${name}</div>${desc ? `<div class="desc">${desc}</div>` : ""}</div>`;
      continue;
    }

    // List items
    if (/^[-•*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      if (!inList) { html += "<ul>"; inList = true; }
      const content = trimmed.replace(/^[-•*]\s+/, "").replace(/^\d+\.\s+/, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      html += `<li>${content}</li>`;
      continue;
    }

    // Normal paragraph
    if (inList) { html += "</ul>"; inList = false; }
    const content = trimmed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html += `<p>${content}</p>`;
  }

  if (inList) html += "</ul>";
  if (inRiskBox) html += "</div>";
  return html;
}

// ─── Client Preview HTML Template ────────────────────────────────────────────
export function buildClientPreviewHTML(aiText: string, familyName: string, date: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 11px;
    color: #2A2520;
    line-height: 1.7;
    background: #FDF8F0;
  }
  
  .header {
    text-align: center;
    padding: 28px 0 20px;
    border-bottom: 1px solid rgba(184,150,46,0.3);
    margin-bottom: 28px;
  }
  
  .crest {
    margin-bottom: 12px;
  }
  
  .header h1 {
    font-family: Cambria, Georgia, serif;
    font-size: 20px;
    color: #1B2A4A;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-weight: 400;
  }
  
  .header .subtitle {
    color: #B8962E;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-top: 6px;
  }
  
  .opening {
    font-family: Cambria, Georgia, serif;
    font-size: 13px;
    color: #1B2A4A;
    font-style: italic;
    line-height: 1.8;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(184,150,46,0.2);
  }
  
  h2.section-heading {
    font-family: Cambria, Georgia, serif;
    font-size: 13px;
    color: #1B2A4A;
    font-style: italic;
    font-weight: 400;
    margin: 22px 0 10px 0;
    padding-bottom: 6px;
    border-bottom: 2px solid #B8962E;
    display: inline-block;
  }
  
  p {
    margin-bottom: 10px;
    line-height: 1.75;
  }
  
  .neighbourhood-block {
    background: #FDF8F0;
    border-left: 3px solid #B8962E;
    padding: 12px 16px;
    margin: 10px 0;
    border-radius: 0 4px 4px 0;
  }
  
  .neighbourhood-block .name {
    font-family: Cambria, Georgia, serif;
    font-size: 12px;
    color: #1B2A4A;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .neighbourhood-block .desc {
    font-size: 11px;
    color: #2A2520;
    line-height: 1.65;
  }
  
  .footer {
    margin-top: 36px;
    padding-top: 14px;
    border-top: 1px solid rgba(184,150,46,0.3);
    text-align: center;
    font-size: 9px;
    color: #B8962E;
    letter-spacing: 1.5px;
  }
  
  .footer .tagline {
    color: #888;
    font-size: 9px;
    margin-top: 3px;
    letter-spacing: 0.5px;
  }
</style>
</head>
<body>
  <div class="header">
    <div class="crest">${DOMUS_CREST_SVG}</div>
    <h1>DOMUS Relocations</h1>
    <div class="subtitle">Your Private Milan Preview</div>
  </div>
  
  ${renderClientPreviewContent(aiText)}
  
  <div class="footer">
    domusrelocations.com &middot; Milano
    <div class="tagline">Your private advisory for life in Italy</div>
  </div>
</body>
</html>`;
}

function renderClientPreviewContent(text: string): string {
  const lines = text.split("\n");
  let html = "";
  let isFirstSection = true;
  let inNeighbourhoodSection = false;
  let currentNeighbourhoodName = "";
  let currentNeighbourhoodDesc = "";

  function flushNeighbourhood() {
    if (currentNeighbourhoodName) {
      html += `<div class="neighbourhood-block"><div class="name">${currentNeighbourhoodName}</div><div class="desc">${currentNeighbourhoodDesc.trim()}</div></div>`;
      currentNeighbourhoodName = "";
      currentNeighbourhoodDesc = "";
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Section headings
    if (/^#{1,3}\s/.test(trimmed)) {
      flushNeighbourhood();
      const heading = trimmed.replace(/^#{1,3}\s+/, "");
      inNeighbourhoodSection = /neighbourhood|milan/i.test(heading);

      if (isFirstSection) {
        html += `<div class="opening"><p>${heading}</p>`;
        isFirstSection = false;
      } else {
        html += `<h2 class="section-heading">${heading}</h2>`;
      }
      continue;
    }

    // Neighbourhood name detection (bold or numbered)
    if (inNeighbourhoodSection && (/^\*\*[^*]+\*\*/.test(trimmed) || /^\d+\.\s+\*\*/.test(trimmed))) {
      flushNeighbourhood();
      currentNeighbourhoodName = trimmed.replace(/^\d+\.\s+/, "").replace(/\*\*/g, "").split("—")[0].split(":")[0].trim();
      const rest = trimmed.replace(/^\d+\.\s+/, "").replace(/\*\*[^*]+\*\*/, "").replace(/^[\s—:]+/, "");
      if (rest) currentNeighbourhoodDesc = rest + " ";
      continue;
    }

    if (inNeighbourhoodSection && currentNeighbourhoodName) {
      currentNeighbourhoodDesc += trimmed + " ";
      continue;
    }

    // Regular paragraph
    const content = trimmed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html += `<p>${content}</p>`;
  }

  flushNeighbourhood();

  // Close opening div if it was opened
  if (!isFirstSection && html.includes('<div class="opening">')) {
    html = html.replace('<div class="opening">', '<div class="opening">');
  }

  return html;
}
