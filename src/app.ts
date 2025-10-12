import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import httpStatus from "http-status";
import { authHandler } from "@/app/auth/auth";
import { AppConfig } from "@/app/config/app.config";
import globalErrorHandler from "@/app/middlewares/globalErrorHandler";
import router from "@/app/routes/v1";
import ErrorLogger from "./app/errors/ErrorLogger";
import requestLogger from "./app/middlewares/requestLogger";
import logger from "./utils/logger";

const app: Application = express();
const corsOrigins = AppConfig.getInstance().security.corsOrigins;

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(cookieParser());

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Logging Middleware ---
// IMPORTANT: This must come *before* your routes
app.use(requestLogger);

// biome-ignore lint/correctness/noUnusedFunctionParameters: <explanation> for testing purposes
app.get("/", (req: Request, res: Response) => {
	req.log.info({ user: "guest" }, "User visited the root page.");
	res.json({
		success: true,
		message: "🚀 Piggy Parcel API v1 is running!",
		endpoints: {
			users: "/api/v1/consumer/users",
			health: "/api/v1/health",
			test: "/api/v1/test",
		},
	});
});
app.get("/user-error", (req: Request, res: Response) => {
	try {
		throw new Error("This is a simulated user-facing error!");
	} catch (error) {
		// Use the standardized ErrorLogger
		if (error instanceof Error) {
			ErrorLogger.log(error, { route: req.path, userId: "123" });
		}
		res.status(500).send("An error occurred.");
	}
});
app.all("/api/auth/{*any}", authHandler);

app.use("/api/v1", router);

app.use((req: Request, res: Response) => {
	res.status(httpStatus.NOT_FOUND).json({
		success: false,
		message: "API not found!",
		error: {
			path: req.originalUrl,
			message: "Your requested path is not available",
		},
	});
});
app.use(globalErrorHandler);

export default app;
