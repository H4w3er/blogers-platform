import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {
  }

  async sendConfirmationEmail(email: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to: `${email}`,
      subject: 'Account creation',
      text: `https://some-front.com/confirm-registration?code=${code}`,
    });
  }

}
