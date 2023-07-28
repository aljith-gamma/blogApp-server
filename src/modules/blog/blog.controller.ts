import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards, Req, ParseIntPipe, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('blog')
@UseGuards(AuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  public async createBlog(
    @UploadedFile() file: Express.Multer.File,  
    @Body() createBlogDto: CreateBlogDto,  
    @Req() { user }
  ){
    return this.blogService.createBlog(createBlogDto, file, user);
  }

  @Get('all')
  public async findAll(
    @Req() { user },
    @Query('get') get: string,
    @Query('status') status: string
  ) {
    return this.blogService.findAll(user, get, status);
  }


  @Get('categories')
  public async getAllCategories (){
    return this.blogService.getAllCategories();
  }

  @Get('getblog/:id')
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete('delete/:id')
  public async deleteBlog(
    @Param('id', ParseIntPipe) blogId: number,
    @Req() { user }
  ) {
    return this.blogService.deleteBlog(blogId, user);
  }

  @Post('category')
  public async addCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ){
    return this.blogService.addCategory(createCategoryDto);
  }
}
