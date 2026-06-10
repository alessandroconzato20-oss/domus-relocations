import { Resend } from "resend";
import { ENV } from "./env";

const resend = new Resend(ENV.resendApiKey);

export type EmailPayload = {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
};

/**
 * Format quiz response email
 */
export function formatQuizEmailContent(data: {
  fullName: string;
  email: string;
  profileName: string;
  profileDescription: string;
  recommendations: string[];
  leadScore: number;
  answers: Record<string, unknown>;
}): { subject: string; htmlContent: string; textContent: string } {
  const subject = `New Quiz Submission: ${data.profileName} - ${data.fullName}`;

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B7355;">New Profile Quiz Submission</h2>
          
          <div style="background-color: #f9f7f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #8B7355;">Lead Information</h3>
            <p><strong>Name:</strong> ${data.fullName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Lead Score:</strong> ${data.leadScore}/100</p>
          </div>

          <div style="background-color: #f9f7f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #8B7355;">Profile</h3>
            <p><strong>${data.profileName}</strong></p>
            <p>${data.profileDescription}</p>
          </div>

          <div style="background-color: #f9f7f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #8B7355;">Recommended Services</h3>
            <ul>
              ${data.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
            </ul>
          </div>

          <div style="background-color: #f9f7f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #8B7355;">Quiz Answers</h3>
            <pre style="background-color: #fff; padding: 10px; border-radius: 4px; overflow-x: auto;">
${JSON.stringify(data.answers, null, 2)}
            </pre>
          </div>

          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This is an automated email from DOMUS Relocations. Please do not reply to this email.
          </p>
        </div>
      </body>
    </html>
  `;

  const textContent = `
New Profile Quiz Submission

Lead Information:
Name: ${data.fullName}
Email: ${data.email}
Lead Score: ${data.leadScore}/100

Profile:
${data.profileName}
${data.profileDescription}

Recommended Services:
${data.recommendations.map((rec) => `- ${rec}`).join("\n")}

Quiz Answers:
${JSON.stringify(data.answers, null, 2)}
  `;

  return { subject, htmlContent, textContent };
}

/**
 * Format inquiry email
 */
export function formatInquiryEmailContent(data: {
  fullName: string;
  email: string;
  phone?: string;
  serviceType: string;
  message?: string;
}): { subject: string; htmlContent: string; textContent: string } {
  const subject = `New Inquiry: ${data.serviceType} - ${data.fullName}`;

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8B7355;">New Contact Inquiry</h2>
          
          <div style="background-color: #f9f7f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #8B7355;">Contact Information</h3>
            <p><strong>Name:</strong> ${data.fullName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
            <p><strong>Service Type:</strong> ${data.serviceType}</p>
          </div>

          ${
            data.message
              ? `
          <div style="background-color: #f9f7f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #8B7355;">Message</h3>
            <p>${data.message.replace(/\n/g, "<br>")}</p>
          </div>
          `
              : ""
          }

          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            This is an automated email from DOMUS Relocations. Please do not reply to this email.
          </p>
        </div>
      </body>
    </html>
  `;

  const textContent = `
New Contact Inquiry

Contact Information:
Name: ${data.fullName}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ""}
Service Type: ${data.serviceType}

${data.message ? `Message:\n${data.message}` : ""}
  `;

  return { subject, htmlContent, textContent };
}

/**
 * Send email using Resend service
 */
export async function sendEmailViaResend(payload: EmailPayload): Promise<boolean> {
  try {
    if (!ENV.resendApiKey) {
      console.error("[Resend] API key not configured");
      return false;
    }

    const result = await resend.emails.send({
      from: "noreply@domusrelocations.com",
      to: payload.to,
      subject: payload.subject,
      html: payload.htmlContent,
      text: payload.textContent || payload.htmlContent,
    });

    if (result.error) {
      console.error("[Resend] Failed to send email:", result.error);
      return false;
    }

    console.log("[Resend] Successfully sent email to", payload.to, "ID:", result.data?.id);
    return true;
  } catch (error) {
    console.error("[Resend] Failed to send email:", error);
    return false;
  }
}
