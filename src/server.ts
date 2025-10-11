import { createServer, type Server } from "node:http";
import app from "./app";
import { AppConfig } from "./app/config/AppConfig";
import { pool } from "./db";
import { createEmailConfig, Email } from "./email";

const server: Server = createServer(app);

const unexpectedErrorHandler = (error: unknown) => {
	console.error("🔥 Unexpected Error: ", error);
	gracefulShutdown("Unexpected Error");
};

const gracefulShutdown = async (signal: string) => {
	console.log(`⚠️ ${signal} received. Shutting down gracefully...`);
	await exitHandler();
	process.exit(0);
};

const exitHandler = async () => {
	return new Promise<void>((resolve) => {
		server.close(async () => {
			console.log("💀 Server closed gracefully");
			await pool.end(); //close db pool
			console.log("💀 Database connection closed");
			resolve();
		});
	});
};
async function main() {
	try {
		const config = AppConfig.getInstance();
		const port = config.server.port;
		const apiUrl = config.server.apiUrl;

		// Initialize email service
		const emailConfig = createEmailConfig();
		Email.initialize(emailConfig);

		// await bootstrapSuperAdmin()

		server.listen(port, () => {
			console.log(`🚀 Server listening on port ${port}`);
			console.log(`API URL: ${apiUrl}`);
			console.log(`CORS Origins: ${config.security.corsOrigins.join(", ")}`);
		});
		process.on("uncaughtException", unexpectedErrorHandler);
		process.on("unhandledRejection", unexpectedErrorHandler);
		process.on("SIGINT", () => gracefulShutdown("SIGINT"));
		process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
	} catch (error) {
		console.error("❌ Failed to start server: ", error);
		process.exit(1);
	}
}

main();
