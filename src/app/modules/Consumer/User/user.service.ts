import { fromNodeHeaders } from "better-auth/node";
import { eq } from "drizzle-orm";
import type { IncomingHttpHeaders } from "http";
import { auth } from "@/app/auth/auth";
import { appConfig } from "@/app/config/app.config";
import AppError from "@/app/errors/AppError";
import type { CreateUser, UpdateUser } from "@/app/types";
import { db, user } from "@/db";
import { Email } from "@/email";
import type { User } from "../../Shared/User/user.interface";

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
const changeEmail = async (newEmail: string, headers: IncomingHttpHeaders) => {
	await auth.api.changeEmail({
		body: {
			newEmail: newEmail,
		},
		headers: fromNodeHeaders(headers),
	});
};
const getAllUsers = async () => {
	const users = await db.select().from(user);
	return users;
};

const updateMyProfile = async (
	loggedInUser: User,
	data: UpdateUser,
	id: string,
) => {
	if (loggedInUser.id !== id)
		throw new AppError(403, "You are not allowed to update this profile");
	const a = db.update(user).set(data).where(eq(user.id, id));
	return a;
};

export const UserService = {
	registerUser,
	loginUser,
	requestPasswordReset,
	logoutUser,
	changeEmail,
	getAllUsers,
	updateMyProfile,
};
