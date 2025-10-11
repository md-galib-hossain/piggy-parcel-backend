// Email module exports

export { createEmailConfig } from "./config/EmailConfig";
export { Email } from "./Email";
export { EmailTemplateFactory } from "./factory/EmailTemplateFactory";
export type { EmailData, EmailTemplate } from "./interfaces/EmailTemplate";
export type {
	BaseEmailTemplate,
	BaseTemplateConfig,
} from "./templates/BaseEmailTemplate";
export * from "./types";
