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

  async createBlog(createBlogDto: CreateBlogDto, user) {
    const {content, tags, categoryId, title, description, imageUrl, readTime} = createBlogDto;

    const result = await this.prisma.blog.create({
      data: {
        title,
        description,
        content,
        readTime,
        tags: JSON.parse(tags),
        userId: user.id,
        categoryId: +categoryId,
        imageUrl
      }
    })
    return {
      status: true,
      message: 'Blog posted successfully'
    }
  }

  async uploadImages(files: any, user){
    const promises = files?.files.map((file) => {
      return this.cloudinaryService.uploadImage(file);
    })
    
    const result = await Promise.all(promises);

    const urlData = files.files.map((item) => {
      return {
        id: item.originalname
      }
    })
    
    result.forEach((imgData, i) => {
      urlData[i]['imgUrl'] = imgData.secure_url;
    })
    
    return {
      status: true,
      data: urlData
    }
  }

  async getAllCategories(){
    const categories = await this.prisma.category.findMany();
    
    return {
      categories
    }
  }

  async findBlogs(userId: number, statusQuery: string, skip: string) {
    
    let status: BlogStatus = 'PUBLISHED';
    if(statusQuery === 'published') status =  'PUBLISHED';
    if(statusQuery === 'draft') status = 'DRAFT';
    const blogs = await this.prisma.blog.findMany({
      where: {
        isDeleted: false,
        status,
        userId: userId
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        readTime: true,
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
            category: true,
            id: true
          }
        },
        tags: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      ...(skip && { skip: +skip }), 
      take: 10
    }) 

    return {
      status: true,
      blogs: {
        blogs,
        skip: +skip
      }
    }
  }

  async getAllBlogs(skip: string, query: string){
    
    const blogs = await this.prisma.blog.findMany({
      where: {
        isDeleted: false,
        status: 'PUBLISHED',
        ...(query && {
          content: {
            search: query
          }
        })
      },
      select: {
        id: true,
        title: true,
        description: true,
        readTime: true,
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
      },
      skip: +skip, 
      take: 10
    });

    return {
      status: true, 
      blogs: {
        blogs,
        skip: +skip
      }
    }
  }

  async findOne(id: number, user, check?: string) {
    const blog = await this.prisma.blog.findUnique({
      where: {
        id,
        isDeleted: false,
        ...(check && {
          id_userId: {
            id,
            userId: user.id
          }
        }) 
      },
      select: {
        id: true,
        title: true,
        content: true,
        readTime: true,
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
        },
        ...(check && {
          description: true,
          categoryId: true,
          tags: true
        })
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

  async updateBlog(blogId: number, updateBlogDto: UpdateBlogDto, user) {

    const isBlogExist = await this.prisma.blog.findUnique({
      where: {
        id_userId: {
          id: blogId,
          userId: user.id
        }
      }
    })

    if(!isBlogExist){
      throw new NotFoundException('No such blog exist!');
    }

    const {content, tags, categoryId, title, description, imageUrl, readTime} = updateBlogDto;

    const updatedData = await this.prisma.blog.update({
      where: {
        id_userId: {
          id: blogId,
          userId: user.id
        }
      },
      data: {
        title,
        description,
        imageUrl,
        content,
        readTime,
        categoryId: +categoryId,
        tags: JSON.parse(tags)
      }
    })

    return {
      status: true,
      message: 'Blog updated successfully'
    }
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
