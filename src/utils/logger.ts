// src/utils/logger.ts
import pino from "pino";
import loggerOptions from "../app/config/logger.config";

// Create and export the logger instance
const logger = pino(loggerOptions);

export default logger;
