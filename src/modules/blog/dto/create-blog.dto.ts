import { IsNumber, IsString } from "class-validator";

export class CreateBlogDto {

    @IsString()
    title: string;

    @IsString()
    imageUrl: string;

    @IsString()
    description: string;

    @IsString()
    content: string;

    @IsString()
    readTime: string;
    
    @IsString()
    tags: string;

    @IsString()
    categoryId: string;
}
