import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type { ZodIssueBase } from "zod/v3";
import AppError from "../errors/AppError";
import ErrorLogger from "../errors/ErrorLogger";
import handleDatabaseError from "../errors/handleDatabaseError";
import handleZodError from "../errors/handleZodError";
import type { TErrorSource } from "../types";

export interface ErrorObject {
	message?: string;
	stack?: string;
	statusCode?: number;
	name?: string;
	code?: string;
	constraint?: string;
	detail?: string;
	column?: string;
	table?: string;
	issues?: ZodIssueBase[];
	status?: string; // For Better Auth API errors
}
const globalErrorHandler = (
	err: ErrorObject,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
	const success = false;
	let message = "Something went wrong";
	let errorSources: TErrorSource[] = [
		{
			path: "",
			message: "Something went wrong",
		},
	];

	// The order of checks is mostly great.
	if (err.name === "ZodError") {
		const simplifiedError = handleZodError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorSources = simplifiedError.errorSources;
	} else if (err.code && typeof err.code === "string") {
		// Moved DB error check up to catch it before the generic 'Error'
		const simplifiedError = handleDatabaseError(err as any);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorSources = simplifiedError.errorSources;
	} else if (err instanceof AppError) {
		// This will now also catch UnauthorizedError, ForbiddenError, etc.
		statusCode = err.statusCode;
		message = err.message;
		errorSources = [
			{
				path: "",
				message: err.message,
			},
		];
	} else if (err instanceof Error) {
		message = err.message;
		errorSources = [
			{
				path: "",
				message: err.message,
			},
		];
	}

	ErrorLogger.log(err as Error, {
		message: "GlobalErrorHandler caught an error",
		statusCode,
		path: req.path,
		method: req.method,
		// Be cautious logging the full body in production
		// Pino's redaction should protect sensitive fields
		body: req.body,
	});

	// Send error response
	res.status(statusCode).json({
		success,
		message,
		errorSources,
		// Only include stack in non-production environments
		stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
	});
};

export default globalErrorHandler;
