import { IsNumber, IsString } from "class-validator";

export class CreateBlogDto {

    file: Express.Multer.File 

    @IsString()
    title: string;
    
    @IsString()
    description: string;

    @IsString()
    tags: string;

    @IsString()
    categoryId: string;
}
