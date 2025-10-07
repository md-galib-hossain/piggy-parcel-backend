import httpStatus from "http-status";
import { TErrorSource, TGenericErrorResponse } from "../types";

interface DatabaseError {
  code: string;
  constraint?: string;
  detail?: string;
  column?: string;
  table?: string;
}

const handleDatabaseError = (err: DatabaseError): TGenericErrorResponse => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Database error";
  const errorSources: TErrorSource[] = [];

  switch (err.code) {
    case '23505': // Unique constraint violation
      statusCode = httpStatus.CONFLICT;
      message = "Duplicate entry found";
      errorSources.push({
        path: err.constraint || "field",
        message: "This value already exists"
      });
      break;

    case '23503': // Foreign key constraint violation
      statusCode = httpStatus.BAD_REQUEST;
      message = "Referenced record not found";
      errorSources.push({
        path: err.constraint || "reference",
        message: "The referenced item does not exist"
      });
      break;

    case '23502': // Not null constraint violation
      statusCode = httpStatus.BAD_REQUEST;
      message = "Required field missing";
      errorSources.push({
        path: err.column || "field",
        message: "This field is required"
      });
      break;

    case '23514': // Check constraint violation
      statusCode = httpStatus.BAD_REQUEST;
      message = "Invalid data format";
      errorSources.push({
        path: err.constraint || "field",
        message: "The provided value is invalid"
      });
      break;

    case '42P01': // Table does not exist
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = "Database configuration error";
      errorSources.push({
        path: "database",
        message: "Required database table not found"
      });
      break;

    case '42703': // Column does not exist
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = "Database schema error";
      errorSources.push({
        path: "database",
        message: "Database column not found"
      });
      break;

    case '28000': // Invalid authorization
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = "Database connection error";
      errorSources.push({
        path: "database",
        message: "Authentication failed"
      });
      break;

    default:
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = "Unexpected database error";
      errorSources.push({
        path: "database",
        message: err.detail || "An unexpected error occurred"
      });
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handleDatabaseError;
