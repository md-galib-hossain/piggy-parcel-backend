import { EmailTemplateFactory } from "../factory/EmailTemplateFactory";
import { EmailServiceConfig } from "../types";
import { Resend } from "resend";
import { emailQueue } from "../queue/email.queue";

// Global config instance - will be set by the consumer
let emailConfig: EmailServiceConfig | null = null;
let isInitialized = false;

/**
 * Initialize the email service with configuration
 * This should be called once during application startup
 */
export function initializeEmailService(config: EmailServiceConfig): void {
  emailConfig = config;
  isInitialized = true;
}



/**
 * Get the current email configuration
 * Throws an error if the service hasn't been initialized
 */
function getEmailConfig(): EmailServiceConfig {
  if (!emailConfig) {
    throw new Error(
      "Email service not initialized. Call initializeEmailService() with your configuration first."
    );
  }
  return emailConfig;
}

export async function sendEmail(
  templateName: string,
  to: string,
  data: any,
  options?: {
    cc?: string[];
    bcc?: string[];
    attachments?: { path: string; name?: string }[];
  }
) {
  try {
    const config = getEmailConfig();
    
    if (!config.resendApiKey) {
      throw new Error("RESEND_API_KEY is required for email service.");
    }

    // Create template and render email data
    const template = EmailTemplateFactory.createTemplate(templateName);
    const emailData = template.render(data);
    
    // Send email using Resend
    const resend = new Resend(config.resendApiKey);
    
    // Prepare email options
    const emailOptions: any = {
      from: config.emailFrom ?? "noreply@piggyparcel.com",
      to: to,
      subject: emailData.subject,
      html: emailData.html,
    };

    // Add optional fields only if they have values
    if (options?.cc && options.cc.length > 0) {
      emailOptions.cc = options.cc;
    }
    
    if (options?.bcc && options.bcc.length > 0) {
      emailOptions.bcc = options.bcc;
    }
    
    if (options?.attachments && options.attachments.length > 0) {
      emailOptions.attachments = options.attachments
        .map(attachment => ({
          path: attachment.path,
          ...(attachment.name && { name: attachment.name })
        }));
    }

    const { data: response, error } = await resend.emails.send(emailOptions);

    if (error) throw error;
    return response;
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
}

export async function enqueueEmail(
  templateName: string,
  to: string,
  data: unknown,
  options?: {
    cc?: string[];
    bcc?: string[];
    attachments?: { path: string; name?: string }[];
  }
): Promise<void> {
  getEmailConfig(); 

  await emailQueue.add("sendEmail", { templateName, to, data, ...(options && { options }) });
}
