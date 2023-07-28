import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { BlogStatus } from '@prisma/client';

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

  async findAll(user, get: string, statusQuery: string) {
    let status: BlogStatus = 'PUBLISHED';
    if(statusQuery === 'published') status =  'PUBLISHED';
    if(statusQuery === 'draft') status = 'DRAFT';
    const blogs = await this.prisma.blog.findMany({
      where: {
        isDeleted: false,
        status: status,
        ...(get === 'mine' && { userId: user.id})
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
      },
      orderBy: {
        createdAt: 'desc'
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

  async deleteBlog(blogId: number, user) {

    const isBlogExist = await this.prisma.blog.findUnique({
      where: {
        id_userId: {
          id: blogId,
          userId: user.id
        },
        isDeleted: false
      }
    })

    if(!isBlogExist){
      throw new NotFoundException('No such blog exist!');
    }
    
    const deletedBlog = await this.prisma.blog.update({
      where: { 
        id: isBlogExist.id,
        isDeleted: false
      },
      data: {
        isDeleted: true,
        status: BlogStatus.DELETED
      }
    })

    return {
      status: true,
      message: 'Blog deleted successfully'
    }
  }

  async addCategory({ category }: CreateCategoryDto){

    const isCategoryExist = await this.prisma.category.findUnique({
      where: {
        category
      }
    })

    if(isCategoryExist){
      throw new ConflictException('Category already exist!');
    }

    const reponse = await this.prisma.category.create({
      data: {
        category
      }
    })

    return {
      status: true,
      message: 'Category successfully created',
      category
    }
  }
}
