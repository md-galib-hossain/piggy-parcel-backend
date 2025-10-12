import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { toNodeHandler } from "better-auth/node";
import { admin as adminPlugin, emailOTP } from "better-auth/plugins";
import { ac, roles } from "@/app/auth/permissions";
import { appConfig } from "@/app/config/AppConfig";
import {
	account,
	db,
	rateLimit,
	session,
	user,
	verification,
} from "@/db/index";
import { Email } from "@/email";

const authSchema = { user, session, account, verification, rateLimit };

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
	onAPIError: {
		throw: true,
		onError: (error, ctx) => {
			// Custom error handling
			console.error("Auth error:", { error });
		},
		// errorURL: "/auth/error",
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		minPasswordLength: 6,
		sendResetPassword: async ({ user, url, token }) => {
			const frontendResetUrl = `${appConfig.auth.url}/reset-password`;
			const resetUrl = new URL(url);
			resetUrl.searchParams.set("callbackURL", frontendResetUrl);
			await Email.sendPasswordResetEmail(user.email, {
				userName: user.name,
				resetLink: resetUrl.toString(),
			});
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		expiresIn: 3600,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url, token }) => {
			const link = new URL(url);
			link.searchParams.set("callbackURL", "/auth/verify");
			await Email.sendAccountVerificationLink(user.email, {
				userName: user.name,
				verificationLink: link.toString(),
			});
		},
	},
	user: {
		additionalFields: {
			userName: { type: "string", defaultValue: "", input: true },
			role: { type: "string", input: false },
		},
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async (
				{ user, newEmail, url, token },
				request,
			) => {
				await Email.sendChangeEmailVerification(user.email, {
					userName: user.name,
					verificationLink: url,
					newEmail: newEmail,
				});
			},
		},
	},
	advanced: {
		cookiePrefix: "piggy-parcel",
		ipAddress: {
			ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
			disableIpTracking: false,
		},
	},
	rateLimit: {
		storage: "memory",
		enabled: true,
		window: 60,
		max: 100,
		customRules: {
			"/two-factor/*": async (request) => ({ window: 10, max: 3 }),
		},
	},
	plugins: [
		adminPlugin({
			defaultRole: "USER",
			adminRoles: ["ADMIN", "SUPERADMIN"],
			ac,
			roles,
			adminUserIds: [],
			defaultBanReason: "No reason",
			impersonationSessionDuration: 86400,
		}),
		emailOTP({
			sendVerificationOnSignUp: true,
			otpLength: 6,
			expiresIn: 600,
			allowedAttempts: 5,
			overrideDefaultEmailVerification: true,
			async sendVerificationOTP({ email, otp, type }) {
				console.log(`Sending ${type} OTP ${otp} to ${email}`);
				// add your email sending logic here
			},
		}),
	],
});

export const authHandler = toNodeHandler(auth);
