import { Queue } from "bullmq";
import { redisConnection } from "./redis.connection";

export interface EmailJobData {
	templateName: string;
	to: string;
	data: unknown;
	options?: {
		cc?: string[];
		bcc?: string[];
		attachments?: { path: string; name?: string }[];
	};
}

export const emailQueue = new Queue<EmailJobData>("emailQueue", {
	connection: redisConnection,
	defaultJobOptions: {
		attempts: 3, // retry up to 3 times on failure
		backoff: {
			type: "exponential",
			delay: 3000, // retry delay starts at 3s, doubles each time
		},
		removeOnComplete: true,
		removeOnFail: false,
	},
});
