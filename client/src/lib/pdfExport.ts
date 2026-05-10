import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportQuizToPDF(
  quizNumber: number,
  persona: string,
  answers: Record<string, string>,
  email: string,
  createdDate: string
) {
  // Create a temporary container for rendering
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.width = "800px";
  container.style.padding = "40px";
  container.style.background = "white";
  container.style.fontFamily = "'Jost', sans-serif";
  container.style.color = "#2d2926";
  document.body.appendChild(container);

  // Build HTML content
  const answersHTML = Object.entries(answers)
    .map(
      ([question, answer]) => `
    <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #e5e1d8;">
      <div style="font-weight: 600; font-size: 14px; color: #2d2926; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
        ${question}
      </div>
      <div style="font-size: 14px; color: #2d2926;">
        ${answer}
      </div>
    </div>
  `
    )
    .join("");

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="font-size: 12px; color: #9a9a9a; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px;">
        DOMUS RELOCATIONS
      </div>
      <h1 style="font-size: 32px; font-weight: 300; font-style: italic; margin: 0 0 24px 0; color: #2d2926;">
        Your Relocation Profile
      </h1>
      <div style="font-size: 14px; color: #6b6b6b;">
        Quiz Response #${quizNumber} • ${createdDate}
      </div>
    </div>

    <div style="margin-bottom: 40px; padding: 24px; background: #faf8f5; border-left: 4px solid #d6af62;">
      <div style="font-size: 12px; color: #9a9a9a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
        Your Persona
      </div>
      <div style="font-size: 24px; font-weight: 300; font-style: italic; color: #2d2926;">
        ${persona}
      </div>
    </div>

    <div style="margin-bottom: 40px;">
      <div style="font-size: 14px; font-weight: 600; color: #2d2926; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.5px;">
        Your Answers
      </div>
      ${answersHTML}
    </div>

    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e1d8; font-size: 12px; color: #9a9a9a;">
      <div style="margin-bottom: 8px;">
        <strong>Email:</strong> ${email}
      </div>
      <div style="margin-bottom: 8px;">
        <strong>Generated:</strong> ${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div style="margin-top: 16px; font-size: 11px; color: #b0b0b0;">
        This document contains your personalized relocation profile from DOMUS Relocations.
        <br />
        Share this with your relocation advisor for a tailored consultation.
      </div>
    </div>
  `;

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    let heightLeft = canvas.height * (imgWidth / canvas.width);
    let position = 0;

    // Add image to PDF, handling multiple pages if needed
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, heightLeft);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - canvas.height * (imgWidth / canvas.width);
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, heightLeft);
      heightLeft -= pageHeight;
    }

    // Download PDF
    pdf.save(`DOMUS_Quiz_Response_${quizNumber}_${persona.replace(/\s+/g, "_")}.pdf`);
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}
