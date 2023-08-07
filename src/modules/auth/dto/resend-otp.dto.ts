import { IsEmail, IsString } from "class-validator";

export class ResendOtpDto {

    @IsEmail()
    email: string;
}
