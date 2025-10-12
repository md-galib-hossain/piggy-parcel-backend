// src/app/middlewares/requestLogger.ts
import pinoHttp from "pino-http";
import { v4 as uuidv4 } from "uuid";
import logger from "../../utils/logger";

const requestLogger = pinoHttp({
	logger,
	// Define a custom request ID function
	genReqId: (req, res) => {
		const existingId = req.id ?? req.headers["x-request-id"];
		if (existingId) return existingId;
		const id = uuidv4();
		res.setHeader("X-Request-Id", id);
		return id;
	},
	// Customize the log message
	customSuccessMessage: (req, res) => `${req.method} ${req.url} completed`,
	customErrorMessage: (req, res, err) =>
		`${req.method} ${req.url} errored with status ${res.statusCode}: ${err.message}`,
});

export default requestLogger;
