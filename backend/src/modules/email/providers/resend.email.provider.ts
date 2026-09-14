import { Resend } from "resend";

import { EmailProvider, SendEmailOptions } from "./email.provider.js";

export class ResendEmailProvider implements EmailProvider {
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
