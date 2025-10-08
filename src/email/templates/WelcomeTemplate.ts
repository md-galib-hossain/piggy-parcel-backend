import { EmailData } from "../interfaces/EmailTemplate";
import { BaseEmailTemplate, BaseTemplateConfig } from "./BaseEmailTemplate";

export class WelcomeTemplate extends BaseEmailTemplate {
  constructor(config?: BaseTemplateConfig) {
    super(config);
  }

  render(data: { userName: string }): EmailData {
    return this.buildEmail(data);
  }

  protected getEmailContent(data: { userName: string }): { subject: string; bodyHtml: string } {
    const { userName } = data;
    const subject = `Welcome to ${this.appName}, ${userName}!`;
    
    const bodyHtml = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Welcome, ${userName}! 🎉</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0;">
          Thank you for joining ${this.appName}. We're excited to have you on board!
        </p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Get started by exploring our features or contacting our support team.
        </p>
        <a href="${this.config?.apiUrl || '#'}" 
           style="display: inline-block; padding: 12px 30px; background-color: ${this.primaryColor}; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">
          Explore Now
        </a>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #888; font-size: 14px; line-height: 1.5; margin: 0;">
          Need help getting started? <a href="${this.config?.apiUrl || '#'}/support" style="color: ${this.primaryColor}; text-decoration: none;">Contact our support team</a>
        </p>
      </div>
    `;
    
    return { subject, bodyHtml };
  }
}
