import type { EmailData } from "../interfaces/EmailTemplate";
import {
	BaseEmailTemplate,
	type BaseTemplateConfig,
} from "./BaseEmailTemplate";

export interface AccountVerificationLinkData {
	userName: string;
	verificationLink: string;
	validDuration?: string; // Optional duration for link validity (e.g., "24 hours")
}

export class AccountVerificationLinkTemplate extends BaseEmailTemplate {
	constructor(config?: BaseTemplateConfig) {
		super(config);
	}

	render(data: AccountVerificationLinkData): EmailData {
		return this.buildEmail(data);
	}

	protected getEmailContent(data: AccountVerificationLinkData): {
		subject: string;
		bodyHtml: string;
	} {
		const { userName, verificationLink, validDuration } = data;
		const subject = `Verify Your ${this.appName} Account`;

		const bodyHtml = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Account Verification</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Hello ${userName},<br/>
          Please click the button below to verify your account:
        </p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <a href="${verificationLink}" 
             style="display: inline-block; padding: 12px 30px; background-color: ${this.primaryColor}; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">
            Verify Your Account
          </a>
        </div>
        ${
					validDuration
						? `<p style="color: #666; font-size: 14px; line-height: 1.5; margin: 0;">
                This link is valid for ${validDuration}.
              </p>`
						: ""
				}
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #888; font-size: 14px; line-height: 1.5; margin: 0;">
          If you didn't request this verification, please ignore this email or contact our
          <a href="${this.config?.apiUrl || "#"}/support" style="color: ${this.primaryColor}; text-decoration: none;">support team</a>.
        </p>
      </div>
    `;

		return { subject, bodyHtml };
	}
}
