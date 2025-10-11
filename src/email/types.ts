// Email types
export interface EmailServiceConfig {
	resendApiKey: string;
	emailFrom?: string;
	server: {
		apiUrl: string;
	};
}

export interface EmailOptions {
	cc?: string[];
	bcc?: string[];
	attachments?: { path: string; name?: string }[];
}

export interface WelcomeEmailData {
	userName: string;
}

export interface PasswordResetEmailData {
	userName: string;
	resetLink: string;
}

export interface DeliveryUpdateEmailData {
	userName: string;
	trackingNumber: string;
	status: string;
	estimatedDelivery?: string;
}

export interface OrderConfirmationEmailData {
	customerName: string;
	orderNumber: string;
	items: Array<{
		name: string;
		quantity: number;
		price: string;
	}>;
}

export interface AccountVerificationLinkData {
	userName: string;
	verificationLink: string;
}
