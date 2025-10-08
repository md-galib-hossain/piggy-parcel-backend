/**
 * Clean and easy-to-use Email class with static methods
 * Usage: Email.sendWelcomeEmail(to, userData)
 */

import { enqueueEmail, initializeEmailService } from "./service/email.service";
import { EmailServiceConfig, EmailOptions, WelcomeEmailData, PasswordResetEmailData, DeliveryUpdateEmailData, OrderConfirmationEmailData, AccountVerificationLinkData } from "./types";

export class Email {
  private static isInitialized = false;

  /**
   * Initialize the email service - call this once at app startup
   */
  static initialize(config: EmailServiceConfig): void {
    initializeEmailService(config);
    this.isInitialized = true;
  }

  /**
   * Check if the email service is initialized
   */
  private static checkInitialization(): void {
    if (!this.isInitialized) {
      throw new Error(
        "Email service not initialized. Call Email.initialize(config) first."
      );
    }
  }

  /**
   * Send a welcome email to a new user
   */
  static async sendWelcomeEmail(
    to: string,
    data: WelcomeEmailData,
    options?: EmailOptions
  ): Promise<any> {
    this.checkInitialization();
    return enqueueEmail("welcome", to, data, options);
  }

  /**
   * Send a password reset email
   */
  static async sendPasswordResetEmail(
    to: string,
    data: PasswordResetEmailData,
    options?: EmailOptions
  ): Promise<any> {
    this.checkInitialization();
    return enqueueEmail("passwordReset", to, data, options);
  }

  /**
   * Send an account verification link email
   */
  static async sendAccountVerificationLink(
    to: string,
    data: AccountVerificationLinkData,
    options?: EmailOptions
  ): Promise<any> {
    this.checkInitialization();
    return enqueueEmail("emailVerification", to, data, options);
  }

  /**
   * Send a delivery update email
   */
  static async sendDeliveryUpdateEmail(
    to: string,
    data: DeliveryUpdateEmailData,
    options?: EmailOptions
  ): Promise<any> {
    this.checkInitialization();
    return enqueueEmail("deliveryUpdate", to, data, options);
  }

  /**
   * Send an order confirmation email (requires custom template registration)
   */
  static async sendOrderConfirmationEmail(
    to: string,
    data: OrderConfirmationEmailData,
    options?: EmailOptions
  ): Promise<any> {
    this.checkInitialization();
    return enqueueEmail("orderConfirmation", to, data, options);
  }

  /**
   * Generic method to send any registered template
   */
  static async sendCustomEmail(
    templateName: string,
    to: string,
    data: any,
    options?: EmailOptions
  ): Promise<any> {
    this.checkInitialization();
    return enqueueEmail(templateName, to, data, options);
  }

  /**
   * Send email to multiple recipients
   */
  static async sendBulkEmail(
    templateName: string,
    recipients: string[],
    data: any,
    options?: EmailOptions
  ): Promise<any[]> {
    this.checkInitialization();
    
    const promises = recipients.map(recipient =>
      enqueueEmail(templateName, recipient, data, options)
    );
    
    return Promise.allSettled(promises);
  }

  /**
   * Send personalized emails to multiple recipients with different data
   */
  static async sendPersonalizedBulkEmail(
    templateName: string,
    recipientsWithData: Array<{ to: string; data: any }>,
    options?: EmailOptions
  ): Promise<any[]> {
    this.checkInitialization();
    
    const promises = recipientsWithData.map(({ to, data }) =>
      enqueueEmail(templateName, to, data, options)
    );
    
    return Promise.allSettled(promises);
  }
}
