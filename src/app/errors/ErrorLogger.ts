// src/app/errors/ErrorLogger.ts
/** biome-ignore-all lint/complexity/noStaticOnlyClass: <explanation> */
import logger from "../../utils/logger";

// Define a type for additional context
type ErrorContext = Record<string, unknown> & {
	message?: string;
};

class ErrorLogger {
	/**
	 * Logs an error with its full context.
	 * @param error - The error object.
	 * @param context - Additional context to log with the error.
	 */
	public static log(error: Error, context: ErrorContext = {}): void {
		const errorLog = {
			...context,
			// Pass the error under the 'err' key for Pino to serialize it correctly
			err: {
				name: error.name,
				message: error.message,
				stack: error.stack,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				code: (error as any).code, // Include error code if available
			},
		};

		logger.error(errorLog, context.message || "An application error occurred.");
	}
}

export default ErrorLogger;
