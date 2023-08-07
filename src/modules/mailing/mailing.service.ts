
import  * as nodemailer from 'nodemailer'
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailingService {

    public async sendMail (email: string, otp: string) {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASS, 
            }
          });
          const mailOptions = {
            from: process.env.EMAIL,
            subject: 'OTP Verification',
            to: email,
            html: `<h1>OTP Mail</h1>
                <p><div>Your OTP for verification is: <strong>${otp}</strong></div>
                <p>Please use this OTP within the next 5 minutes to log in to your account.</p>
                <p>If you did not request this OTP, please ignore this email.</p>
                <p>Best regards,</p></p>`
          };

          const res = await transporter.sendMail(mailOptions);
          console.log(res);
    }
}
