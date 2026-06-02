import { PDFDocument, rgb } from 'pdf-lib';

export interface QuizReportData {
  fullName: string;
  email: string;
  profileName: string;
  profileDescription: string;
  recommendations: string[];
  leadScore: number;
  timeline: string;
  familyComposition: string;
  preferences: string[];
  preferredContact: string;
  relocationExperience: string;
}

/**
 * Generate a professional PDF report for quiz results
 * Returns the PDF as a Buffer that can be saved or sent via email
 */
export async function generateQuizReportPDF(data: QuizReportData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  
  // Add a page
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();
  
  // Define colors matching DOMUS brand
  const goldColor = rgb(218 / 255, 180 / 255, 105 / 255); // #DAB469
  const darkColor = rgb(30 / 255, 30 / 255, 30 / 255); // #1E1E1E
  const textColor = rgb(80 / 255, 80 / 255, 80 / 255); // #505050
  
  let yPosition = height - 50;
  
  // Header with DOMUS branding
  page.drawText('DOMUS RELOCATIONS', {
    x: 50,
    y: yPosition,
    size: 24,
    color: darkColor,
  });
  
  yPosition -= 10;
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    color: goldColor,
    thickness: 2,
  });
  
  yPosition -= 30;
  
  // Title
  page.drawText('Your Personalized Relocation Profile', {
    x: 50,
    y: yPosition,
    size: 18,
    color: darkColor,
  });
  
  yPosition -= 25;
  
  // Profile name (large, prominent)
  page.drawText(data.profileName, {
    x: 50,
    y: yPosition,
    size: 28,
    color: goldColor,
  });
  
  yPosition -= 35;
  
  // Profile description
  const descriptionLines = wrapText(data.profileDescription, 90);
  for (const line of descriptionLines) {
    page.drawText(line, {
      x: 50,
      y: yPosition,
      size: 11,
      color: textColor,
    });
    yPosition -= 15;
  }
  
  yPosition -= 15;
  
  // Lead score section
  page.drawText('Your Priority Level', {
    x: 50,
    y: yPosition,
    size: 12,
    color: darkColor,
  });
  
  yPosition -= 18;
  
  const scorePercentage = Math.round(data.leadScore);
  const scoreLabel = scorePercentage >= 75 ? 'HIGH PRIORITY' : scorePercentage >= 50 ? 'STANDARD' : 'FUTURE PLANNING';
  
  page.drawText(`${scoreLabel} (Score: ${scorePercentage}/100)`, {
    x: 50,
    y: yPosition,
    size: 11,
    color: goldColor,
  });
  
  yPosition -= 25;
  
  // Recommended services
  page.drawText('Recommended Services for You', {
    x: 50,
    y: yPosition,
    size: 12,
    color: darkColor,
  });
  
  yPosition -= 18;
  
  for (const rec of data.recommendations) {
    page.drawText(`• ${rec}`, {
      x: 60,
      y: yPosition,
      size: 10,
      color: textColor,
    });
    yPosition -= 15;
  }
  
  yPosition -= 15;
  
  // Your profile details
  page.drawText('Your Profile Details', {
    x: 50,
    y: yPosition,
    size: 12,
    color: darkColor,
  });
  
  yPosition -= 18;
  
  const details = [
    { label: 'Timeline', value: data.timeline },
    { label: 'Family Composition', value: data.familyComposition },
    { label: 'Relocation Experience', value: data.relocationExperience },
    { label: 'Preferred Contact Method', value: data.preferredContact },
  ];
  
  for (const detail of details) {
    page.drawText(`${detail.label}:`, {
      x: 50,
      y: yPosition,
      size: 10,
      color: darkColor,
    });
    
    page.drawText(detail.value, {
      x: 180,
      y: yPosition,
      size: 10,
      color: textColor,
    });
    
    yPosition -= 15;
  }
  
  yPosition -= 20;
  
  // Footer
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    color: goldColor,
    thickness: 1,
  });
  
  yPosition -= 20;
  
  page.drawText('Next Steps', {
    x: 50,
    y: yPosition,
    size: 11,
    color: darkColor,
  });
  
  yPosition -= 15;
  
  const nextSteps = [
    'Our team will reach out to you shortly to discuss your personalized relocation plan.',
    'We will arrange a consultation at your preferred time and contact method.',
    'Together, we will create a comprehensive relocation strategy tailored to your needs.',
  ];
  
  for (const step of nextSteps) {
    const stepLines = wrapText(step, 90);
    for (const line of stepLines) {
      page.drawText(line, {
        x: 60,
        y: yPosition,
        size: 9,
        color: textColor,
      });
      yPosition -= 12;
    }
    yPosition -= 5;
  }
  
  yPosition -= 15;
  
  page.drawText('Contact: milano@domusrelocations.com', {
    x: 50,
    y: yPosition,
    size: 9,
    color: goldColor,
  });
  
  // Save PDF to buffer
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Wrap text to fit within a specified character width
 */
function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    if ((currentLine + word).length > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
  }
  
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}
