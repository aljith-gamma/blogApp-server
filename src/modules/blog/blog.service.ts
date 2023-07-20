import { Injectable, NotFoundException } from '@nestjs/common';
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
    const { title, description, tags, categoryId} = createBlogDto;

    const res = await this.cloudinaryService.uploadImage(file);
    const { secure_url } = res;

    const result = await this.prisma.blog.create({
      data: {
        title,
        description,
        tags: JSON.parse(tags),
        imageUrl: secure_url,
        userId: user.id,
        categoryId: +categoryId
      }
    })
    return {
      status: true,
      message: 'Blog posted successfully'
    }
  }

  async getAllCategories(){
    const categories = await this.prisma.category.findMany();

    return {
      categories
    }
  }

  async findAll(user) {
    
    const blogs = await this.prisma.blog.findMany({
      where: {
        isDeleted: false,
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            userName: true,
            profile: {
              select: {
                avatarUrl: true
              }
            }
          }
        },
        category: {
          select: {
            category: true
          }
        }
      }
    }) 

    return {
      status: true,
      blogs
    }
  }

  async findOne(id: number) {
    const blog = await this.prisma.blog.findUnique({
      where: {
        id,
        isDeleted: false
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            userName: true,
            profile: {
              select: {
                avatarUrl: true
              }
            }
          }
        },
        category: {
          select: {
            category: true
          }
        }
      }
    })

    if(!blog){
      throw new NotFoundException('No such blog exist!');
    }

    return {
      status: true,
      blog
    }
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
