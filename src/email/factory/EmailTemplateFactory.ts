import { EmailTemplate } from "../interfaces/EmailTemplate";
import { WelcomeTemplate } from "../templates/WelcomeTemplate";
import { PasswordResetTemplate } from "../templates/PasswordResetTemplate";
import { DeliveryUpdateTemplate } from "../templates/DeliveryUpdateTemplate";
import { BaseTemplateConfig } from "../templates/BaseEmailTemplate";
import { AccountVerificationLinkTemplate } from "../templates/AccountVerificationLink";
import { OrderConfirmationTemplate } from "../templates/OrderConfirmationTemplate";

// Re-export for convenience
export type { BaseTemplateConfig as TemplateConfig };

export class EmailTemplateFactory {
  private static templates = new Map<string, (config?: BaseTemplateConfig) => EmailTemplate>([
    ["welcome", (config) => new WelcomeTemplate(config)],
    ["passwordReset", (config) => new PasswordResetTemplate(config)],
    ["emailVerification", (config) => new AccountVerificationLinkTemplate(config)],
    ["deliveryUpdate", (config) => new DeliveryUpdateTemplate(config)],
    ["orderConfirmation", (config) => new OrderConfirmationTemplate(config)],
  ]);

  private static globalConfig: BaseTemplateConfig | undefined;

  static setGlobalConfig(config: BaseTemplateConfig): void {
    this.globalConfig = config;
  }

  static createTemplate(templateName: string, config?: BaseTemplateConfig): EmailTemplate {
    const templateCreator = this.templates.get(templateName);
    if (!templateCreator) {
      throw new Error(`Email template "${templateName}" not found. Available templates: ${Array.from(this.templates.keys()).join(", ")}`);
    }
    
    // Use provided config or fall back to global config
    const effectiveConfig = config || this.globalConfig;
    return templateCreator(effectiveConfig);
  }

  static registerTemplate(name: string, templateCreator: (config?: BaseTemplateConfig) => EmailTemplate): void {
    this.templates.set(name, templateCreator);
  }

  static getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }
}
