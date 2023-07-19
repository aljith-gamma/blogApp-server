import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user-Dto';
import { SignupUserDto } from './dto/signup-user-Dto';

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


}
