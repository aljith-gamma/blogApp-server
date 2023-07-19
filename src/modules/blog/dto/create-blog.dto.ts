import { IsArray, IsString } from "class-validator";

export class CreateBlogDto {
    @IsString()
    title: string;
    
    @IsString()
    description: string;

    @IsArray()
    @IsString({ each: true})
    tags: string[];
}
