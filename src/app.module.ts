import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MailingModule } from './modules/mailing/mailing.module';

@Module({
  imports: [
    AuthModule,
    BlogModule,
    CloudinaryModule,
    ProfileModule,
    MailingModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
