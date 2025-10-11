/**
 * Simple email configuration setup
 */

import { appConfig } from "../../app/config/AppConfig";
import { EmailTemplateFactory } from "../factory/EmailTemplateFactory";
import type { BaseTemplateConfig } from "../templates/BaseEmailTemplate";
import type { EmailServiceConfig } from "../types";

/**
 * Quick setup function for email configuration
 */
export function createEmailConfig(): EmailServiceConfig {
	// Set global template configuration
	const templateConfig: BaseTemplateConfig = {
		apiUrl: appConfig.server.apiUrl,
		appName: "Piggy Parcel",
		primaryColor: "#4CAF50",
	};

	EmailTemplateFactory.setGlobalConfig(templateConfig);

	return {
		resendApiKey: appConfig.email.resendApiKey,
		emailFrom: appConfig.email.from,
		server: {
			apiUrl: appConfig.server.apiUrl,
		},
	};
}
