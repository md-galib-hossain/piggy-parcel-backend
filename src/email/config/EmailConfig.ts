/**
 * Simple email configuration setup
 */

import { EmailServiceConfig } from "../types";
import { BaseTemplateConfig } from "../templates/BaseEmailTemplate";
import { EmailTemplateFactory } from "../factory/EmailTemplateFactory";
import { appConfig } from "../../app/config/AppConfig";

/**
 * Quick setup function for email configuration
 */
export function createEmailConfig(): EmailServiceConfig {
  // Set global template configuration
  const templateConfig: BaseTemplateConfig = {
    apiUrl: appConfig.server.apiUrl,
    appName: "Piggy Parcel",
    primaryColor: "#4CAF50"
  };

  EmailTemplateFactory.setGlobalConfig(templateConfig);

  return {
    resendApiKey: appConfig.email.resendApiKey,
    emailFrom: appConfig.email.from || "noreply@piggyparcel.com",
    server: {
      apiUrl: appConfig.server.apiUrl
    }
  };
}
