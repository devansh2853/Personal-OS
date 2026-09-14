import { EmailProvider } from "./providers/email.provider.js";

export class EmailService {
  constructor(private readonly emailProvider: EmailProvider) {}

  async sendVerificationEmail(
    email: string,
    emailVerificationToken: string,
    userId: string,
  ): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(
      emailVerificationToken,
    )}?userId=${encodeURIComponent(userId)}`;

    await this.emailProvider.sendEmail({
      to: email,
      subject: "Verify your Personal OS email",
      text: this.getVerificationEmailText(verificationUrl),
      html: this.getVerificationEmailHtml(verificationUrl),
    });
  }

  private getVerificationEmailText(verificationUrl: string): string {
    return `
Welcome to Personal OS!

Please verify your email address by visiting the following link:

${verificationUrl}

This verification link will expire in 24 hours.

If you did not create a Personal OS account, you can ignore this email.
    `.trim();
  }

  private getVerificationEmailHtml(verificationUrl: string): string {
    return `
      <h2>Welcome to Personal OS!</h2>

      <p>
        Please verify your email address by clicking the link below.
      </p>

      <p>
        <a href="${verificationUrl}">
          Verify your email
        </a>
      </p>

      <p>
        This verification link will expire in 24 hours.
      </p>

      <p>
        If you did not create a Personal OS account, you can ignore this email.
      </p>
    `.trim();
  }
}
