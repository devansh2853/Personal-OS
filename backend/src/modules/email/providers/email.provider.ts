export type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export interface EmailProvider {
  sendEmail(options: SendEmailOptions): Promise<void>;
}
