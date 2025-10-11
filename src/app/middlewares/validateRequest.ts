import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type { TErrorSource } from "../types";

interface ValidationError {
	issues: Array<{
		path: (string | number)[];
		message: string;
	}>;
}

interface ValidationSchema {
	parseAsync: (data: unknown) => Promise<unknown>;
}

const validateRequest = (
	schema: ValidationSchema,
	target: "body" | "query" | "params" = "body",
) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			// Validate the specified part of the request (body, query, or params)
			await schema.parseAsync(req[target]);
			return next();
		} catch (error) {
			// Check if it's a Zod validation error
			if (error && typeof error === "object" && "issues" in error) {
				const validationError = error as ValidationError;
				const errorSources: TErrorSource[] = validationError.issues.map(
					(err) => ({
						path: err.path.join(".") || target, // Use target as fallback path for clarity
						message: err.message || "Validation failed",
					}),
				);

				return res.status(httpStatus.BAD_REQUEST).json({
					success: false,
					message: `Validation Error in ${target}`,
					errorSources,
				});
			}

			// Pass other errors to global error handler
			next(error);
		}
	};
};

export default validateRequest;
