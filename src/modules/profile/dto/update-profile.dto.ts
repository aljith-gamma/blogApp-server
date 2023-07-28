import { IsString, Matches } from "class-validator";


export class UpdateProfileDto {

    avatar: Express.Multer.File;

    @IsString()
    firstName: string;
    
    @IsString()
    lastName: string;

    @IsString()
    bio: string;

    @IsString()
    @Matches(/^[a-z@$0-9]+$/, { message: 'Invalid userName format' })
    userName: string;
}