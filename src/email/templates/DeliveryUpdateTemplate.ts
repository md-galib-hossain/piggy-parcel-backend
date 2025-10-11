import type { EmailData } from "../interfaces/EmailTemplate";
import {
	BaseEmailTemplate,
	type BaseTemplateConfig,
} from "./BaseEmailTemplate";

export class DeliveryUpdateTemplate extends BaseEmailTemplate {
	constructor(config?: BaseTemplateConfig) {
		super(config);
	}

	render(data: {
		userName: string;
		trackingNumber: string;
		status: string;
		estimatedDelivery?: string;
	}): EmailData {
		return this.buildEmail(data);
	}

	protected getEmailContent(data: {
		userName: string;
		trackingNumber: string;
		status: string;
		estimatedDelivery?: string;
	}): { subject: string; bodyHtml: string } {
		const { userName, trackingNumber, status, estimatedDelivery } = data;
		const subject = `Your Parcel is ${status}! 📦`;
		const apiUrl = this.config?.apiUrl || "#";

		// Get status-specific styling and emoji
		const statusInfo = this.getStatusInfo(status);

		const bodyHtml = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Delivery Update ${statusInfo.emoji}</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0;">
          Hi ${userName},
        </p>
      </div>
      
      <div style="background-color: ${statusInfo.bgColor}; border: 1px solid ${statusInfo.borderColor}; padding: 25px; border-radius: 8px; margin: 25px 0;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h3 style="color: ${statusInfo.textColor}; margin: 0 0 10px 0; font-size: 18px;">
            Your parcel is now <strong>${status.toLowerCase()}</strong>!
          </h3>
          <p style="color: #333; font-size: 16px; margin: 0;">
            Tracking Number: <strong style="font-family: monospace; background-color: #f8f9fa; padding: 2px 6px; border-radius: 4px;">${trackingNumber}</strong>
          </p>
        </div>
        
        ${
					estimatedDelivery
						? `
          <div style="text-align: center; margin: 15px 0;">
            <p style="color: #333; font-size: 16px; margin: 0;">
              <strong>Estimated Delivery:</strong> ${estimatedDelivery}
            </p>
          </div>
        `
						: ""
				}
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="${apiUrl}/track/${trackingNumber}" 
             style="display: inline-block; padding: 12px 30px; background-color: ${this.primaryColor}; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Track Your Package
          </a>
        </div>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
          Track your parcel for real-time updates and delivery notifications.
        </p>
        <p style="color: #888; font-size: 14px; line-height: 1.5; margin: 0;">
          Questions about your delivery? <a href="${apiUrl}/support" style="color: ${this.primaryColor}; text-decoration: none;">Contact our support team</a>
        </p>
      </div>
    `;

		return { subject, bodyHtml };
	}

	private getStatusInfo(status: string): {
		emoji: string;
		bgColor: string;
		borderColor: string;
		textColor: string;
	} {
		const statusLower = status.toLowerCase();

		if (statusLower.includes("delivered")) {
			return {
				emoji: "✅",
				bgColor: "#d4edda",
				borderColor: "#c3e6cb",
				textColor: "#155724",
			};
		} else if (statusLower.includes("out for delivery")) {
			return {
				emoji: "🚚",
				bgColor: "#fff3cd",
				borderColor: "#ffeaa7",
				textColor: "#856404",
			};
		} else if (
			statusLower.includes("shipped") ||
			statusLower.includes("transit")
		) {
			return {
				emoji: "📦",
				bgColor: "#cce7ff",
				borderColor: "#99d6ff",
				textColor: "#004085",
			};
		} else {
			return {
				emoji: "📋",
				bgColor: "#f8f9fa",
				borderColor: "#dee2e6",
				textColor: "#495057",
			};
		}
	}
}
