import type { EmailData } from "../interfaces/EmailTemplate";
import {
	BaseEmailTemplate,
	type BaseTemplateConfig,
} from "./BaseEmailTemplate";

export class PasswordResetTemplate extends BaseEmailTemplate {
	// biome-ignore lint/complexity/noUselessConstructor: <explanation> doesn't require it, but based on the code, it's currently required for proper inheritance.
	constructor(config?: BaseTemplateConfig) {
		super(config);
	}

	render(data: { resetLink: string; userName: string }): EmailData {
		return this.buildEmail(data);
	}

	protected getEmailContent(data: { resetLink: string; userName: string }): {
		subject: string;
		bodyHtml: string;
	} {
		const { resetLink, userName } = data;
		const subject = `Reset Your ${this.appName} Password`;

		const bodyHtml = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request 🔒</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0;">
          Hi ${userName},
        </p>
      </div>
      
      <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <p style="color: #856404; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>
        <div style="text-align: center;">
          <a href="${resetLink}" 
             style="display: inline-block; padding: 12px 30px; background-color: ${this.primaryColor}; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Reset Password
          </a>
        </div>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
          <strong>Important:</strong> This link will expire in 24 hours for security reasons.
        </p>
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">
          If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #888; font-size: 14px; line-height: 1.5; margin: 0;">
          Having trouble? <a href="${this.config?.apiUrl || "#"}/support" style="color: ${this.primaryColor}; text-decoration: none;">Contact support</a>
        </p>
      </div>
    `;

		return { subject, bodyHtml };
	}
}
