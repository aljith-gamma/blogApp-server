import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { BlogModule } from './modules/blog/blog.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    AuthModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: '',
          pass: ''
        }
      }
    }),
    BlogModule,
    CloudinaryModule,
    ProfileModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
