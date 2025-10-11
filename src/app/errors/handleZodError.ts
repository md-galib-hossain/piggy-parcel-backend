import type { ZodIssueBase } from "zod/v3";
import type { ErrorObject } from "../middlewares/globalErrorHandler";
import type { TErrorSource, TGenericErrorResponse } from "../types";

const handleZodError = (err: ErrorObject): TGenericErrorResponse => {
	const statusCode = 400;
	const errorSources: TErrorSource[] =
		err.issues?.map((issue: ZodIssueBase) => {
			return {
				path: issue?.path[issue?.path?.length - 1] || issue?.path.join("."),
				message: issue?.message || "Validation error",
			};
		}) || [];

	return {
		statusCode,
		message: "Validation Error",
		errorSources,
	};
};

export default handleZodError;
