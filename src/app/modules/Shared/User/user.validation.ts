import { z } from "zod";

// User Role Schema
export const userRoleSchema = z.enum([
	"USER",
	"ADMIN",
	"SUPERADMIN",
	"MODERATOR",
]);

// Create User Schema
export const createUserSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be less than 100 characters"),
	email: z.email("Invalid email format"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.max(128, "Password must be less than 128 characters"),
	role: userRoleSchema.optional().default("USER"),
	userName: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(30, "Username must be less than 30 characters")
		.optional(),
	image: z.url("Invalid image URL").optional(),
});

// Update User Schema
export const updateUserSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be less than 100 characters")
		.optional(),
	email: z.string().email("Invalid email format").optional(),
	role: userRoleSchema.optional(),
	userName: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(30, "Username must be less than 30 characters")
		.optional(),
	image: z.string().url("Invalid image URL").optional(),
	banned: z.boolean().optional(),
	banReason: z
		.string()
		.max(500, "Ban reason must be less than 500 characters")
		.optional(),
	banExpires: z
		.string()
		.datetime("Invalid ban expiry date")
		.transform((val) => new Date(val))
		.optional(),
});

// Login Schema
export const loginSchema = z.object({
	email: z.email("Invalid email format"),
	password: z.string().min(1, "Password is required"),
});

// Change Password Schema
export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z
			.string()
			.min(6, "New password must be at least 6 characters")
			.max(128, "New password must be less than 128 characters"),
		confirmPassword: z.string().min(1, "Password confirmation is required"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

// Reset Password Request Schema
export const resetPasswordRequestSchema = z.object({
	email: z.email("Invalid email format"),
});

// Reset Password Schema
export const resetPasswordSchema = z
	.object({
		token: z.string().min(1, "Reset token is required"),
		password: z
			.string()
			.min(6, "Password must be at least 6 characters")
			.max(128, "Password must be less than 128 characters"),
		confirmPassword: z.string().min(1, "Password confirmation is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

// Email Verification Schema
export const emailVerificationSchema = z.object({
	token: z.string().min(1, "Verification token is required"),
});

// Query Params for filtering users
export const userQuerySchema = z.object({
	role: userRoleSchema.optional(),
	banned: z
		.string()
		.optional()
		.transform((val) => val === "true"),
	search: z.string().optional(),
	page: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : 1)),
	limit: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : 10)),
});

// User ID Param Schema
export const userParamsSchema = z.object({
	id: z.string().min(1, "User ID is required"),
});

// Ban User Schema
export const banUserSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
	reason: z
		.string()
		.min(1, "Ban reason is required")
		.max(500, "Ban reason must be less than 500 characters"),
	expiresAt: z
		.string()
		.datetime("Invalid ban expiry date")
		.transform((val) => new Date(val))
		.optional(),
});

// Unban User Schema
export const unbanUserSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
});

// Update Profile Schema (for users updating their own profile)
export const updateProfileSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be less than 100 characters")
		.optional(),
	userName: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(30, "Username must be less than 30 characters")
		.optional(),
	image: z.url("Invalid image URL").optional(),
});

// Change Email Schema
export const changeEmailSchema = z.object({
	email: z.email("Invalid email format"),
});
