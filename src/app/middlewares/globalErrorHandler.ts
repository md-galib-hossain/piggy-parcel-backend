import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type { ZodIssueBase } from "zod/v3";
import AppError from "../errors/AppError";
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
}

const globalErrorHandler = (
	err: ErrorObject,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

	// Handle Zod validation errors
	if (err.name === "ZodError") {
		const simplifiedError = handleZodError(err);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorSources = simplifiedError.errorSources;
	}
	// Handle custom App errors
	else if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
		errorSources = [
			{
				path: "",
				message: err.message,
			},
		];
	}
	// Handle PostgreSQL/Database errors
	else if (err.code && typeof err.code === "string") {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const simplifiedError = handleDatabaseError(err as any);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorSources = simplifiedError.errorSources;
	}
	// Handle general JavaScript errors
	else if (err instanceof Error) {
		message = err.message;
		errorSources = [
			{
				path: "",
				message: err.message,
			},
		];
	}

	// Log error in development (skip NODE_ENV check for now)
	console.error("🚨 Error Details:", {
		message: err.message,
		stack: err.stack,
		statusCode,
		path: req.path,
		method: req.method,
		body: req.body,
		query: req.query,
		params: req.params,
	});

	// Send error response
	res.status(statusCode).json({
		success,
		message,
		errorSources,
		// Include stack trace in development - will be configured later
		...(err.stack && { stack: err.stack }),
	});
};

export default globalErrorHandler;
