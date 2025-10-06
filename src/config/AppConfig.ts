import dotenv from "dotenv";
import { z } from "zod";

// ------------------------------------------------------
// Load environment variables
// ------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV || "development";
const envFile = `.env.${NODE_ENV}`;

// Load from .env.<NODE_ENV> if exists, otherwise fallback to .env
dotenv.config({ path: envFile });
dotenv.config(); // fallback

console.log(`✅ Loaded environment: ${NODE_ENV}`);

// ------------------------------------------------------
// Validate environment variables using Zod
// ------------------------------------------------------
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]),
  PORT: z.coerce.number().int().positive(),

  // Database
  DATABASE_URL: z.string("Database URL is required"),
  DATABASE_NAME: z.string("Database name is required"),
  DATABASE_POOL_SIZE: z.coerce.number().int().positive().default(10).optional(),

  // Authentication
  BETTER_AUTH_SECRET: z.string("BetterAuth secret is required"),
  BETTER_AUTH_URL: z.url("BetterAuth URL is required"),

  // Email
  RESEND_API_KEY: z.string().min(1),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.email("Email from must be a valid email").optional(),

  // API & CORS
  API_URL: z.url("Api url must be valid url").optional(),
  CORS_ORIGINS: z.string().optional(),

  // Super Admin
  SUPER_ADMIN_EMAIL: z.email(),
  SUPER_ADMIN_PASSWORD: z.string().min(1),
  SUPER_ADMIN_NAME: z.string().min(1),
  SUPER_ADMIN_USERNAME: z.string().min(1),

  // Optional
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info").optional(),
  ALLOWED_HOSTS: z.string().optional(),
});

const env = envSchema.parse(process.env);

// ------------------------------------------------------
// Types
// ------------------------------------------------------
export type Environment = "development" | "staging" | "production";

interface DatabaseConfig {
  url: string;
  name: string;
  poolSize?: number | undefined;
}

interface AuthConfig {
  secret: string;
  url: string;
}

interface EmailConfig {
  resendApiKey: string;
  from?: string | undefined;
  smtp?: {
    host?: string | undefined;
    port?: number | undefined;
    user?: string | undefined;
    pass?: string | undefined;
  };
}

interface SuperAdminConfig {
  email: string;
  password: string;
  name: string;
  username: string;
}

interface SecurityConfig {
  corsOrigins: string[];
  allowedHosts?: string[];
}

interface ServerSettings {
  port: number;
  apiUrl: string;
  logLevel: "debug" | "info" | "warn" | "error";
}

// ------------------------------------------------------
// AppConfig Singleton
// ------------------------------------------------------
export class AppConfig {
  private static instance: AppConfig;

  private constructor(private readonly e = env) {}

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  // -----------------------------
  // Environment helpers
  // -----------------------------
  get environment(): Environment {
    return this.e.NODE_ENV;
  }
  get isDevelopment() { return this.e.NODE_ENV === "development"; }
  get isStaging() { return this.e.NODE_ENV === "staging"; }
  get isProduction() { return this.e.NODE_ENV === "production"; }

  // -----------------------------
  // Config Sections
  // -----------------------------
  get server(): ServerSettings {
    return {
      port: this.e.PORT,
      apiUrl: this.e.API_URL ?? `http://localhost:${this.e.PORT}`,
      logLevel: this.e.LOG_LEVEL ?? "info",
    };
  }

  get database(): DatabaseConfig {
    return {
      url: this.e.DATABASE_URL,
      name: this.e.DATABASE_NAME,
      poolSize: this.e.DATABASE_POOL_SIZE,
    };
  }

  get auth(): AuthConfig {
    return {
      secret: this.e.BETTER_AUTH_SECRET,
      url: this.e.BETTER_AUTH_URL,
    };
  }

  get email(): EmailConfig {
    return {
      resendApiKey: this.e.RESEND_API_KEY,
      from: this.e.EMAIL_FROM,
      smtp: {
        host: this.e.SMTP_HOST,
        port: this.e.SMTP_PORT,
        user: this.e.SMTP_USER,
        pass: this.e.SMTP_PASS,
      },
    };
  }

  get superAdmin(): SuperAdminConfig {
    return {
      email: this.e.SUPER_ADMIN_EMAIL,
      password: this.e.SUPER_ADMIN_PASSWORD,
      name: this.e.SUPER_ADMIN_NAME,
      username: this.e.SUPER_ADMIN_USERNAME,
    };
  }

  get security(): SecurityConfig {
    const origins = this.e.CORS_ORIGINS ?? "*";
    const allowedHosts = this.e.ALLOWED_HOSTS
      ? this.e.ALLOWED_HOSTS.split(",").map((h) => h.trim())
      : [];
    return {
      corsOrigins: origins === "*" ? ["*"] : origins.split(",").map((o) => o.trim()),
      allowedHosts,
    };
  }
}


export const appConfig = AppConfig.getInstance();
