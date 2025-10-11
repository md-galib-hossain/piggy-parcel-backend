import type { EmailData } from "../interfaces/EmailTemplate";
import {
	BaseEmailTemplate,
	type BaseTemplateConfig,
} from "./BaseEmailTemplate";

export interface OrderConfirmationData {
	customerName: string;
	orderNumber: string;
	items: Array<{
		name: string;
		quantity: number;
		price: string;
	}>;
}

export class OrderConfirmationTemplate extends BaseEmailTemplate {
	constructor(config?: BaseTemplateConfig) {
		super(config);
	}

	render(data: OrderConfirmationData): EmailData {
		return this.buildEmail(data);
	}

	protected getEmailContent(data: OrderConfirmationData): {
		subject: string;
		bodyHtml: string;
	} {
		const { customerName, orderNumber, items } = data;
		const subject = `Order Confirmation - ${orderNumber}`;

		const totalAmount = items.reduce((total, item) => {
			const price = parseFloat(item.price.replace("$", ""));
			return total + price * item.quantity;
		}, 0);

		const itemsHtml = items
			.map(
				(item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price}</td>
      </tr>
    `,
			)
			.join("");

		const bodyHtml = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Order Confirmation</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0;">
          Thank you for your order, ${customerName}! Your order has been confirmed.
        </p>
      </div>

      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin: 0 0 15px 0; color: #333;">Order Details</h3>
        <p style="margin: 0 0 10px 0; color: #666;"><strong>Order Number:</strong> ${orderNumber}</p>
        <p style="margin: 0; color: #666;"><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin: 25px 0;">
        <h3 style="margin: 0 0 15px 0; color: #333;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #eee;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Item</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Quantity</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #f8f9fa; font-weight: bold;">
              <td colspan="2" style="padding: 15px; text-align: right; border-top: 2px solid #dee2e6;">Total:</td>
              <td style="padding: 15px; text-align: right; border-top: 2px solid #dee2e6;">$${totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 25px 0; text-align: center;">
        <p style="margin: 0; color: #155724; font-weight: 500;">
          Your order is being processed. We'll send you updates on the shipping status.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #888; font-size: 14px; line-height: 1.5; margin: 0;">
          Questions about your order? <a href="${this.config?.apiUrl || "#"}/support" style="color: ${this.primaryColor}; text-decoration: none;">Contact our support team</a>
        </p>
      </div>
    `;

		return { subject, bodyHtml };
	}
}
