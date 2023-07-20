import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlogService {

  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService
  ){};

  async createBlog(createBlogDto: CreateBlogDto, file, user) {
    const { title, description, tags} = createBlogDto;

    const res = await this.cloudinaryService.uploadImage(file);
    const { secure_url } = res;

    const result = await this.prisma.blog.create({
      data: {
        title,
        description,
        tags: tags,
        imageUrl: secure_url,
        userId: user.id
      }
    })
    return createBlogDto;
  }

  async getAllCategories(){
    const categories = await this.prisma.category.findMany();

    return {
      categories
    }
  }

  findAll() {
    return `This action returns all blog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
