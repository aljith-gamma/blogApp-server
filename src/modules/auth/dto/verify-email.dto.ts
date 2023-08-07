import { IsEmail, IsString } from "class-validator";

export class VerifyEmailDto {

    @IsString()
    otp: string;

    @IsEmail()
    email: string;
}
