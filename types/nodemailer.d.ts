declare module "nodemailer" {
  type MailAddress = string | { name?: string; address: string };

  type SendMailOptions = {
    from?: MailAddress;
    to?: MailAddress | MailAddress[];
    replyTo?: MailAddress;
    subject?: string;
    text?: string;
    html?: string;
  };

  type TransportOptions = {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };

  type Transporter = {
    sendMail(options: SendMailOptions): Promise<unknown>;
  };

  export function createTransport(options: TransportOptions): Transporter;

  const nodemailer: {
    createTransport: typeof createTransport;
  };

  export default nodemailer;
}
