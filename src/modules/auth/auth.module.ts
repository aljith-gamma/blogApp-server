import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailingModule } from '../mailing/mailing.module';

@Module({
  imports: [
    PrismaModule,
    MailingModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
