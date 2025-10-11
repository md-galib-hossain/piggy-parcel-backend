import type { EmailTemplate } from "../interfaces/EmailTemplate";
import { AccountVerificationLinkTemplate } from "../templates/AccountVerificationLink";
import type { BaseTemplateConfig } from "../templates/BaseEmailTemplate";
import { DeliveryUpdateTemplate } from "../templates/DeliveryUpdateTemplate";
import { OrderConfirmationTemplate } from "../templates/OrderConfirmationTemplate";
import { PasswordResetTemplate } from "../templates/PasswordResetTemplate";
import { WelcomeTemplate } from "../templates/WelcomeTemplate";

// Re-export for convenience
export type { BaseTemplateConfig as TemplateConfig };

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation> Utility class for creating email templates.
export class EmailTemplateFactory {
	private static templates = new Map<
		string,
		(config?: BaseTemplateConfig) => EmailTemplate
	>([
		["welcome", (config) => new WelcomeTemplate(config)],
		["passwordReset", (config) => new PasswordResetTemplate(config)],
		[
			"emailVerification",
			(config) => new AccountVerificationLinkTemplate(config),
		],
		["deliveryUpdate", (config) => new DeliveryUpdateTemplate(config)],
		["orderConfirmation", (config) => new OrderConfirmationTemplate(config)],
	]);

	private static globalConfig: BaseTemplateConfig | undefined;

	static setGlobalConfig(config: BaseTemplateConfig): void {
		EmailTemplateFactory.globalConfig = config;
	}

	static createTemplate(
		templateName: string,
		config?: BaseTemplateConfig,
	): EmailTemplate {
		const templateCreator = EmailTemplateFactory.templates.get(templateName);
		if (!templateCreator) {
			throw new Error(
				`Email template "${templateName}" not found. Available templates: ${Array.from(EmailTemplateFactory.templates.keys()).join(", ")}`,
			);
		}

		// Use provided config or fall back to global config
		const effectiveConfig = config || EmailTemplateFactory.globalConfig;
		return templateCreator(effectiveConfig);
	}

	static registerTemplate(
		name: string,
		templateCreator: (config?: BaseTemplateConfig) => EmailTemplate,
	): void {
		EmailTemplateFactory.templates.set(name, templateCreator);
	}

	static getAvailableTemplates(): string[] {
		return Array.from(EmailTemplateFactory.templates.keys());
	}
}
