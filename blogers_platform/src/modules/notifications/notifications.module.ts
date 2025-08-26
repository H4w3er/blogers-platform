import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { EmailService } from "./email.service";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp.mail.ru",
        port: 465,
        secure: true,
        auth: {
          user: "mr.gavrik378@list.ru",
          pass: 'YT6NU1a4Z5XgAPQM9syQ',
        },
      },
      defaults: {
        from: '"Artem" <mr.gavrik378@list.ru>',
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}
