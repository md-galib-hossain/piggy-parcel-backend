import { fromNodeHeaders } from "better-auth/node";
import type { IncomingHttpHeaders } from "http";
import { auth } from "@/app/auth/auth";
import { appConfig } from "@/app/config/AppConfig";
import AppError from "@/app/errors/AppError";
import type { CreateUser } from "@/app/types";
import { Email } from "@/email";

const registerUser = async (userData: CreateUser) => {
	const user = await auth.api.signUpEmail({
		body: {
			name: userData.name,
			email: userData.email,
			password: userData.password,
		},
	});

	// Send welcome email

	await Email.sendWelcomeEmail(userData.email, {
		userName: userData.name,
	});
	console.log(`📧 Welcome email sent to ${userData.email}`);

	// Don't throw error for email failure, just log it

	return user;
};

const loginUser = async (email: string, password: string) => {
	const user = await auth.api.signInEmail({
		body: {
			email,
			password,
		},
	});

	try {
		await Email.sendWelcomeEmail(user.user.email, {
			userName: user.user.name,
		});
		console.log(`📧 Welcome email sent to ${user.user.email}`);
	} catch (error) {
		console.error("Failed to send welcome email:", error);
		// Don't throw error for email failure, just log it
	}

	if (!user) throw new AppError(404, "User not found");
	return user;
};

const requestPasswordReset = async (email: string) => {
	// Generate a simple token (in production, use JWT or secure random token)

	const url = appConfig.auth.url;
	const data = await auth.api.requestPasswordReset({
		body: {
			email: email,
			redirectTo: `${url}/reset-password`,
		},
	});

	// const res = await Email.sendPasswordResetEmail(email, {
	// 	userName: "User", // In real app, get from database
	// 	resetLink: resetLink,
	// });

	return data;
};

const logoutUser = async (headers: IncomingHttpHeaders) => {
	await auth.api.signOut({
		headers: fromNodeHeaders(headers),
	});
};
export const UserService = {
	registerUser,
	loginUser,
	requestPasswordReset,
	logoutUser,
};
