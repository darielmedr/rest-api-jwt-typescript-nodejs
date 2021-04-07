import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import config from '../config/config';
import EmailResponse from '../models/email-response';
import PasswordResetEmailData from '../models/password-reset-email-data';

class EmailSender {
    private transporter!: nodemailer.Transporter;
    private smtpOptions: SMTPTransport.Options = {
        host: config.EMAIL.HOST,
        port: 587,
        auth: {
            user: config.EMAIL.USER,
            pass: config.EMAIL.PASSWORD
        }
    };

    constructor() {
        this.transporter = nodemailer.createTransport(this.smtpOptions);
    }

    public async sendPasswordResetEmail(emailData: PasswordResetEmailData): Promise<EmailResponse> {
        const data: Mail.Options = {
            from: 'LuthierOtero admin team<password-reset-noreply@luthierotero.com>',
            to: emailData.userEmail,
            subject: "LuthierOthero account password reset",
            html: `
                <h1>Reset Password</h1>
                <br />
                <p>
                    <span>Please click</span>
                    <a href="${config.CLIENT_URL.CHANGE_PASSWORD}/${emailData.token}">here</a>
                    <span>to reset your password.</span>
                </p>
            `
        };

        let emailResponse: EmailResponse = {
            success: false,
            message: "Error. Couldn't send the Reset Password email."
        };
        await this.transporter.sendMail(data)
            .then((data: any) => {
                emailResponse = {
                    success: true
                }
            })
            .catch((err: any) => {
                emailResponse = {
                    success: false,
                    message: err
                }
            });

        return (emailResponse);
    }
}

const emailSender = new EmailSender();
export default emailSender;