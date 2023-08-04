import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards, Req, ParseIntPipe, Query, UploadedFiles } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('blog')
@UseGuards(AuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10}
  ]))
  public async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() { user }
  ){
    return this.blogService.uploadImages(files, user);
  }

  @Post('create')
  public async createBlog( 
    @Body() createBlogDto: CreateBlogDto,  
    @Req() { user }
  ){
    return this.blogService.createBlog(createBlogDto, user);
  }

  @Get('all')
  public async getAllBlogs(
    @Query('skip') skip: string,
    @Query('q') query: string
  ){
    return this.blogService.getAllBlogs(skip, query);
  }

  @Get('get')
  public async findBlogs(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('status') status: string,
    @Query('skip') skip: string
  ) {
    return this.blogService.findBlogs(userId, status, skip);
  }

  @Get('categories')
  public async getAllCategories (){
    return this.blogService.getAllCategories();
  }

  @Get('getblog/:id')
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('check') check: string,
    @Req() { user }
  ) {
    return this.blogService.findOne(id, user, check);
  }

  @Patch(':id')
  public async updateBlog(
    @Param('id', ParseIntPipe) blogId: number, 
    @Body() updateBlogDto: CreateBlogDto,
    @Req() { user }
  ) {
    return this.blogService.updateBlog(blogId, updateBlogDto, user);
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
