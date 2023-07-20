import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';

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

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get('categories')
  public async getAllCategories (){
    return this.blogService.getAllCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
