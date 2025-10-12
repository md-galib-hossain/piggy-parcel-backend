// src/app/config/logger.config.ts
import type { LoggerOptions } from "pino";
import { appConfig } from "./app.config";

// Define the logger options
const loggerOptions: LoggerOptions = {
	level: appConfig.server.logLevel,
	// Redact sensitive information to prevent it from appearing in logs
	redact: {
		paths: ["req.headers.authorization", "user.password", "body.password"],
		censor: "**REDACTED**",
	},
};

// Use pino-pretty for human-readable logs only in development
if (appConfig.isDevelopment) {
	loggerOptions.transport = {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
			ignore: "pid,hostname",
		},
	};
}

export default loggerOptions;
