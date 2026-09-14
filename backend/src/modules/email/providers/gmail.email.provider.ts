import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import { EmailProvider, SendEmailOptions } from "./email.provider.js";

export class GmailEmailProvider implements EmailProvider {
  private readonly transporter: Transporter;
  private readonly email: string;

  constructor(email: string, appPassword: string) {
    this.email = email;

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: appPassword,
      },
    });
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: this.email,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  }
}
