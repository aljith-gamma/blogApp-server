import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { v2 } from 'cloudinary';

@Module({
  providers: [
    CloudinaryService,
    {
      provide: 'Cloudinary',
      useFactory: (): void => {
        v2.config({
          cloud_name: process.env.CLOUDINARY_NAME ,
          api_key: process.env.CLOUDINARY_API_KEY ,
          api_secret:process.env.CLOUDINARY_API_SECRET 
        })
      }
    }
  ],
  exports: [CloudinaryService]
})
export class CloudinaryModule {}
