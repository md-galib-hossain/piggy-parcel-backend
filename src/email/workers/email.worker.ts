import { type Job, Worker } from "bullmq";
import { Resend } from "resend";
import { createEmailConfig } from "../config/EmailConfig";
import { EmailTemplateFactory } from "../factory/EmailTemplateFactory";
import type { EmailJobData } from "../queue/email.queue";
import { redisConnection } from "../queue/redis.connection";

// Load your app config (or env)
const config = createEmailConfig();

console.log("🚀 Email Worker starting...");
console.log(
	"📧 Resend API Key configured:",
	config.resendApiKey ? "YES" : "NO",
);
console.log("📧 From Email:", config.emailFrom);
console.log("🌐 API URL:", config.server.apiUrl);

const resend = new Resend(config.resendApiKey);

export const emailWorker = new Worker<EmailJobData>(
	"emailQueue",
	async (job: Job<EmailJobData>) => {
		const { templateName, to, data, options } = job.data;

		console.log(`📨 Processing email job ${job.id}: ${templateName} to ${to}`);

		try {
			const template = EmailTemplateFactory.createTemplate(templateName);
			const emailData = template.render(data);

			console.log(`📧 Sending email: ${emailData.subject} to ${to}`);

			const result = await resend.emails.send({
				from: config.emailFrom,
				to,
				subject: emailData.subject,
				html: emailData.html,
				...(options?.cc && { cc: options.cc }),
				...(options?.bcc && { bcc: options.bcc }),
				...(options?.attachments && { attachments: options.attachments }),
			});

			console.log(
				`✅ Email sent successfully to ${to} with template "${templateName}"`,
			);
			console.log("📧 Resend response:", result);

			return result;
		} catch (error) {
			console.error(`❌ Failed to send email to ${to}:`, error);
			throw error; // Re-throw so BullMQ knows the job failed
		}
	},
	{ connection: redisConnection },
);

emailWorker.on("completed", (job) => {
	console.log(`✅ Job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => {
	console.error(`❌ Job ${job?.id} failed:`, err);
});

emailWorker.on("ready", () => {
	console.log("🎯 Email worker is ready and listening for jobs");
});

emailWorker.on("error", (err) => {
	console.error("💥 Email worker error:", err);
});

console.log("🎯 Email worker initialized and waiting for jobs...");
