import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import httpStatus from "http-status";
import { authHandler } from "@/app/auth/auth";
import { AppConfig } from "@/app/config/AppConfig";
import router from "@/app/routes";

const app: Application = express();
const corsOrigins = AppConfig.getInstance().security.corsOrigins;

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(cookieParser());

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// biome-ignore lint/correctness/noUnusedFunctionParameters: <explanation> for testing purposes
app.get("/", (req: Request, res: Response) => {
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
// app.use(globalErrorHandler);

export default app;
