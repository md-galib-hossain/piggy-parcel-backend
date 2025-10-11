import { eq } from "drizzle-orm";
import { auth } from "@/app/auth/auth";
import { AppConfig } from "@/app/config/AppConfig";
import { db, user } from "@/db";
import { createEmailConfig, Email } from "@/email";

export function initializeEmailService() {
	const config = AppConfig.getInstance();

	Email.initialize(
		createEmailConfig({
			resendApiKey: config.email.resendApiKey,
			fromEmail: config.email.from,
			apiUrl: config.server.apiUrl || "http://localhost:5000",
			appName: "Piggy Parcel",
			primaryColor: "#4CAF50",
			logoUrl: "https://i.postimg.cc/sxJWbWSp/logoipsum-406.png",
		}),
	);

	console.log("📧 Email service initialized successfully!");
}

export const seedSuperAdmin = async () => {
	try {
		const config = AppConfig.getInstance();
		const email = config.superAdmin.email;

		console.log("Bootstrapping superAdmin...");

		// check if user exists
		const [existingUser] = await db
			.select()
			.from(user)
			.where(eq(user.email, email))
			.limit(1);

		if (existingUser) {
			// if SUPERADMIN not included, append it
			if (existingUser.role !== "SUPERADMIN") {
				await db
					.update(user)
					.set({ role: "SUPERADMIN" })
					.where(eq(user.email, email));

				console.log("🔑 Updated existing user with SUPERADMIN role");
			} else {
				console.log("✅ Superadmin already exists");
			}
		} else {
			await auth.api.signUpEmail({
				body: {
					email: config.superAdmin.email,
					password: config.superAdmin.password,
					userName: config.superAdmin.name,
					name: config.superAdmin.name,
				},
			});
			await db
				.update(user)
				.set({ role: "SUPERADMIN" })
				.where(eq(user.email, email));

			console.log("🚀 Superadmin created successfully");
		}

		// send welcome email
		try {
			await Email.sendWelcomeEmail(email, {
				userName: config.superAdmin.name,
			});
			console.log(`📧 Welcome email sent to ${email}`);
		} catch (err) {
			console.error("Failed to send welcome email:", err);
		}
	} catch (error) {
		console.error("❌ Failed to bootstrap superAdmin:", error);
	}
};
