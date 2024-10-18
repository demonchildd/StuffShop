import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    
    constructor(private config: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: this.config.get('SMTP_EMAIL'),
                pass: this.config.get('SMTP_PASSWORD')
            }
        });
    }

    async sendConfirmationCode(email: string, code: string): Promise<void> {
        const mailOptions = {
            from: String(process.env.SMTP_SENDER_EMAIL),
            to: email,
            subject: 'Код подтверждения заказа',
            text: `Ваш код подтверждения заказа: ${code}`,
        };

        await this.transporter.sendMail(mailOptions);
    }
    }