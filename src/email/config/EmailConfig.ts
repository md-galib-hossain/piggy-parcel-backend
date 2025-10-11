/**
 * Simple email configuration setup
 */

import { EmailTemplateFactory } from "../factory/EmailTemplateFactory";
import type { EmailServiceConfig } from "../index";
import type { BaseTemplateConfig } from "../templates/BaseEmailTemplate";

/**
 * Quick setup function for email configuration
 */
export function createEmailConfig(options: {
	resendApiKey: string;
	fromEmail: string;
	apiUrl: string;
	appName: string;
	primaryColor?: string;
	logoUrl?: string;
}): EmailServiceConfig {
	const templateConfig: BaseTemplateConfig = {
		apiUrl: options.apiUrl,
		appName: options.appName,
		primaryColor: options.primaryColor || "#4CAF50",
	};

	if (options.logoUrl) {
		templateConfig.logoUrl = options.logoUrl;
	}

	EmailTemplateFactory.setGlobalConfig(templateConfig);

	return {
		resendApiKey: options.resendApiKey,
		emailFrom: options.fromEmail,
		server: {
			apiUrl: options.apiUrl,
		},
	};
}
