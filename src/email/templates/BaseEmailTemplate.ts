import type { EmailData, EmailTemplate } from "../interfaces/EmailTemplate";

export interface BaseTemplateConfig {
	apiUrl?: string;
	appName: string;
	primaryColor?: string;
	logoUrl?: string;
}

export abstract class BaseEmailTemplate implements EmailTemplate {
	protected appName: string;
	protected primaryColor: string;
	protected config: BaseTemplateConfig | undefined;

	constructor(config?: BaseTemplateConfig) {
		this.config = config;
		this.appName = config?.appName || "Piggy Parcel";
		this.primaryColor = config?.primaryColor || "#4CAF50";
	}

	// Abstract method that each template must implement
	abstract render(data: any): EmailData;

	// Protected method to get email content - can be overridden by subclasses
	protected abstract getEmailContent(data: any): {
		subject: string;
		bodyHtml: string;
	};

	// Common header - can be overridden if needed
	protected getHeader(): string {
		const logoUrl = this.getLogo();
		return `
      <div style="background-color: ${this.primaryColor}; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        ${logoUrl ? `<img src="${logoUrl}" alt="${this.appName} Logo" style="max-width: 150px; margin-bottom: 10px;" />` : ""}
        <h1 style="color: white; margin: 0; font-family: Arial, sans-serif; font-size: 28px; font-weight: bold;">${this.appName}</h1>
      </div>
    `;
	}

	// Common footer - can be overridden if needed
	protected getFooter(): string {
		const currentYear = new Date().getFullYear();
		const websiteLink = this.config?.apiUrl;

		return `
      <div style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 8px 8px; border-top: 1px solid #dee2e6;">
        <div style="margin-bottom: 15px;">
          <p style="margin: 0 0 8px 0;">&copy; ${currentYear} ${this.appName}. All rights reserved.</p>
          ${websiteLink ? `<p style="margin: 0;"><a href="${websiteLink}" style="color: ${this.primaryColor}; text-decoration: none; font-weight: 500;">Visit our website</a></p>` : ""}
        </div>
        <div style="font-size: 11px; color: #adb5bd;">
          <p style="margin: 0;">This email was sent to you because you are a valued member of our community.</p>
        </div>
      </div>
    `;
	}

	// Helper method to get logo URL - can be overridden
	protected getLogo(): string {
		if (this.config?.logoUrl) {
			return this.config.logoUrl;
		}
		return this.config?.apiUrl ? `${this.config.apiUrl}/logo.png` : "";
	}

	// Common email wrapper - provides consistent styling
	protected wrapEmailContent(bodyHtml: string): string {
		return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        ${this.getHeader()}
        <div style="padding: 30px 20px;">
          ${bodyHtml}
        </div>
        ${this.getFooter()}
      </div>
    `;
	}

	// Default implementation that most templates can use
	protected buildEmail(data: any): EmailData {
		const { subject, bodyHtml } = this.getEmailContent(data);
		const fullHtml = this.wrapEmailContent(bodyHtml);

		return {
			subject,
			html: fullHtml,
		};
	}
}
