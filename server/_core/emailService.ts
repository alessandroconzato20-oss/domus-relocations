import { invokeLLM } from "./llm";

/**
 * Send email via the Manus built-in email service
 */
export async function sendEmail({
  to,
  subject,
  htmlContent,
}: {
  to: string;
  subject: string;
  htmlContent: string;
}): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
      },
      body: JSON.stringify({
        to,
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send email:", response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

/**
 * Format quiz answers for email display
 */
export function formatQuizAnswersForEmail(
  answers: Record<string, string>,
  persona: string,
  fullName: string,
  email: string,
  createdAt: Date
): string {
  const formattedAnswers = Object.entries(answers)
    .map(([question, answer], index) => {
      return `<tr>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-family: Arial, sans-serif; font-size: 14px;">
          <strong>Q${index + 1}: ${question}</strong>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-family: Arial, sans-serif; font-size: 14px;">
          ${answer}
        </td>
      </tr>`;
    })
    .join("");

  const createdDateFormatted = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          border-bottom: 3px solid #d6af62;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header h2 {
          margin: 0;
          color: #2d2926;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0 0 0;
          color: #666;
          font-size: 14px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #2d2926;
          margin-bottom: 10px;
          border-left: 4px solid #d6af62;
          padding-left: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #e0e0e0;
          font-family: Arial, sans-serif;
          font-size: 14px;
        }
        .persona-box {
          background-color: #f9f7f3;
          border-left: 4px solid #d6af62;
          padding: 15px;
          margin-bottom: 15px;
        }
        .persona-label {
          font-size: 12px;
          font-weight: bold;
          color: #d6af62;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        .persona-value {
          font-size: 18px;
          font-weight: normal;
          color: #2d2926;
        }
        .footer {
          border-top: 1px solid #e0e0e0;
          padding-top: 15px;
          margin-top: 20px;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Persona Quiz Submission</h2>
          <p>Submitted on ${createdDateFormatted}</p>
        </div>

        <div class="section">
          <div class="section-title">Respondent Information</div>
          <table>
            <tr>
              <td style="border-bottom: 1px solid #e0e0e0;"><strong>Name:</strong></td>
              <td style="border-bottom: 1px solid #e0e0e0;">${fullName}</td>
            </tr>
            <tr>
              <td style="border-bottom: 1px solid #e0e0e0;"><strong>Email:</strong></td>
              <td style="border-bottom: 1px solid #e0e0e0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Quiz Responses</div>
          <table>
            ${formattedAnswers}
          </table>
        </div>

        <div class="section">
          <div class="persona-box">
            <div class="persona-label">Assigned Persona</div>
            <div class="persona-value">${persona}</div>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated email from DOMUS Relocations. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Format contact inquiry for email display
 */
export function formatContactInquiryForEmail(
  fullName: string,
  email: string,
  message: string,
  createdAt: Date
): string {
  const createdDateFormatted = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          border-bottom: 3px solid #d6af62;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .header h2 {
          margin: 0;
          color: #2d2926;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0 0 0;
          color: #666;
          font-size: 14px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #2d2926;
          margin-bottom: 10px;
          border-left: 4px solid #d6af62;
          padding-left: 10px;
        }
        .info-row {
          margin-bottom: 12px;
        }
        .info-label {
          font-weight: bold;
          color: #2d2926;
          font-size: 14px;
        }
        .info-value {
          color: #666;
          font-size: 14px;
          margin-top: 3px;
        }
        .message-box {
          background-color: #f9f7f3;
          border-left: 4px solid #d6af62;
          padding: 15px;
          margin-bottom: 15px;
          line-height: 1.6;
        }
        .footer {
          border-top: 1px solid #e0e0e0;
          padding-top: 15px;
          margin-top: 20px;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Inquiry</h2>
          <p>Received on ${createdDateFormatted}</p>
        </div>

        <div class="section">
          <div class="section-title">Sender Information</div>
          <div class="info-row">
            <div class="info-label">Name:</div>
            <div class="info-value">${fullName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Email:</div>
            <div class="info-value"><a href="mailto:${email}">${email}</a></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Message</div>
          <div class="message-box">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>

        <div class="footer">
          <p>This is an automated email from DOMUS Relocations. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
