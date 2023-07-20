import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: memoryStorage()
    }),
    CloudinaryModule
  ],
  controllers: [BlogController],
  providers: [BlogService ]
})
export class BlogModule {}
