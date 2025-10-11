import { z } from "zod";

// Session Schema
export const sessionSchema = z.object({
	id: z.string().min(1, "Session ID is required"),
	userId: z.string().min(1, "User ID is required"),
	expiresAt: z
		.string()

		.transform((val) => new Date(val)),
	ipAddress: z
		.string()
		.regex(
			/^(\d{1,3}\.){3}\d{1,3}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
			"Invalid IP address",
		)
		.optional(),
	userAgent: z.string().optional(),
});

// Create Session Schema
export const createSessionSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
	expiresAt: z.string().transform((val) => new Date(val)),
	ipAddress: z
		.string()
		.regex(
			/^(\d{1,3}\.){3}\d{1,3}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
			"Invalid IP address",
		)
		.optional(),
	userAgent: z.string().optional(),
});

// Account Schema
export const accountSchema = z.object({
	providerId: z.string().min(1, "Provider ID is required"),
	accountId: z.string().min(1, "Account ID is required"),
	userId: z.string().min(1, "User ID is required"),
	accessToken: z.string().optional(),
	refreshToken: z.string().optional(),
	idToken: z.string().optional(),
	scope: z.string().optional(),
});

// Verification Schema
export const verificationSchema = z.object({
	identifier: z.string().min(1, "Identifier is required"),
	value: z.string().min(1, "Value is required"),
	expiresAt: z
		.string()

		.transform((val) => new Date(val)),
});

// Rate Limit Schema
export const rateLimitSchema = z.object({
	key: z.string().min(1, "Key is required"),
	count: z.number().int().min(0, "Count must be non-negative"),
	lastRequest: z.number().int().min(0, "Last request must be non-negative"),
});

// OAuth Provider Schema
export const oauthProviderSchema = z.enum([
	"google",
	"github",
	"facebook",
	"twitter",
]);

// OAuth Login Schema
export const oauthLoginSchema = z.object({
	provider: oauthProviderSchema,
	code: z.string().min(1, "OAuth code is required"),
	state: z.string().optional(),
	redirectUri: z.string().url("Invalid redirect URI").optional(),
});

// Refresh Token Schema
export const refreshTokenSchema = z.object({
	refreshToken: z.string().min(1, "Refresh token is required"),
});

// Two Factor Auth Setup Schema
export const twoFactorSetupSchema = z.object({
	secret: z.string().min(1, "Secret is required"),
	token: z.string().length(6, "Token must be 6 digits"),
});

// Two Factor Auth Verify Schema
export const twoFactorVerifySchema = z.object({
	token: z.string().length(6, "Token must be 6 digits"),
});
