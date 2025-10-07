import { ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "@piggy/types";
import { ErrorObject } from "../middlewares/globalErrorHandler";

const handleZodError = (err: ErrorObject): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorSources = err.issues?.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue?.path?.length - 1] || issue?.path.join('.'),
      message: issue?.message,
    };
  }) || [];
  
  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

export default handleZodError;