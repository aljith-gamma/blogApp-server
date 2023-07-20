import { IsEmail, IsNotEmpty, IsString, Length, Matches, MinLength } from "class-validator";

export class SignupUserDto {
    @IsString()
    @Matches(/^[a-z@$0-9]+$/, { message: 'Invalid userName format' })
    @MinLength(4)
    userName: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 14)
    @Matches(/^[^\s]+$/, { message: 'Invalid password format' })
    password: string;
}
