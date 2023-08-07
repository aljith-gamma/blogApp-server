import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user-Dto';
import { SignupUserDto } from './dto/signup-user-Dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public async signupUser(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signupUser(signupUserDto);
  }

  @Post('signin')
  public async signinUser(@Body() signinUserDto: SigninUserDto){
    return this.authService.signinUser(signinUserDto)
  }

  @Post('verify-email')
  public async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto
  ){
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-otp')
  public async resendOtp(
    @Body() resendOtpDto: ResendOtpDto
  ){
    return this.authService.resendOtp(resendOtpDto);
  }

}
