import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import express, { Application, Request, Response } from "express";
import { AppConfig } from "./app/config/AppConfig";


const app: Application = express();
const corsOrigins = AppConfig.getInstance().security.corsOrigins;

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(cookieParser());

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "🚀 Piggy Parcel API v1 is running!",
    endpoints: {
      users: "/api/v1/consumer/users",
      health: "/api/v1/health"
    }
  });
});
// app.all('/api/auth/{*any}', authHandler);
// app.use("/api/v1", router);


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
