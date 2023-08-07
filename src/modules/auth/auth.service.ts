import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user-Dto';
import { JwtService } from '@nestjs/jwt';
import { SigninUserDto } from './dto/signin-user-Dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs'
import { RoleType } from '@prisma/client';
import { MailingService } from '../mailing/mailing.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

interface TokenObj {
  id: number;
  role: RoleType
}

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailService: MailingService
  ){}

  async generateToken(tokenObj: TokenObj){
    return this.jwtService.sign(tokenObj);
  }

  async findUserByEmail(email: string){
    return await this.prisma.user.findUnique({
      where: { email, isDeleted: false }
    })
  } 

  generateNumber(){
    return Math.floor(Math.random() * 10);
  }

  generateOtp(){
    const fn = this.generateNumber;
    const otp = `${fn()}${fn()}${fn()}${fn()}`
    return otp;
  }

  getExpirationDate(){
    const currentTimestamp = Date.now();
    const expirationTimestamp = currentTimestamp + 300000;
    const expirationDate = new Date(expirationTimestamp);
    return expirationDate;
  }
  
  async signupUser(signupUserDto: SignupUserDto) {

    const { userName, email, password } = signupUserDto;

    const isUserNameExist = await this.prisma.user.findUnique({
      where: { userName }
    })

    if(isUserNameExist){
      throw new ConflictException({
        status: false,
        message: 'Username already exist!'
      });
    }

    const isEmailExist = await this.findUserByEmail(email);

    if(isEmailExist){
      if(isEmailExist.isVerified){
        throw new ConflictException({
          status: false,
          message: 'User with this email already exist!'
        });
      }else{
        const expirationDate = this.getExpirationDate();
        const otp = this.generateOtp();
        
        await this.prisma.user.update({
          where: {
            id: isEmailExist.id
          },
          data: {
            otp,
            verificationExpiry: expirationDate
          }
        })
        
        await this.mailService.sendMail(email, otp);
        return {
          status: true,
          message: 'otp successfully sent'
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const expirationDate = this.getExpirationDate();
    const otp = this.generateOtp();

    const user = await this.prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
        otp,
        verificationExpiry: expirationDate
      }
    })

    const role = await this.prisma.role.create({
      data: {
        role: RoleType.USER,
        userId: user.id
      }
    })

    await this.mailService.sendMail(email, otp);
    return {
      status: true,
      message: 'otp successfully sent'
    }

  }

  async signinUser(signinUserDto: SigninUserDto) {
    const { email, password } = signinUserDto;

    const isUserExist = await this.findUserByEmail(email);
    
    if(!isUserExist || !isUserExist.isVerified){
      throw new NotFoundException({
        status: false,
        message: "Email doesn't exist"
      })
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true
      }
    })

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if(!isPasswordCorrect){
      throw new UnauthorizedException({
        status: false,
        message: "Incorrect password!"
      });
    }

    const token = await this.generateToken({
      id: user.id,
      role: user.role.role
    })

    return {
      status: true,
      token,
      _id: user.id,
      message: 'Signed in successfully'
    };
  }

  async verifyEmail({ otp, email }: VerifyEmailDto){
    
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        isDeleted: false,
        isVerified: false
      }
    })

    if(!user){
      throw new NotFoundException('No such user exist!');
    }

    const currentTimestamp = Date.now();
    const expirationTimestamp = user.verificationExpiry.getTime();
    const diff = expirationTimestamp - currentTimestamp;
    if(diff < 0){
      throw new HttpException('OTP has expired!', HttpStatus.BAD_REQUEST);
    }
    if(user.otp !== otp){
      throw new HttpException('Entered OTP is wrong!', HttpStatus.BAD_REQUEST);
    }

    const verifiedUser = await this.prisma.user.update({
      where: {
        email,
        isDeleted: false
      },
      data: {
        isVerified: true,
        otp: null,
        verificationExpiry: null
      },
      include: {
        role: true
      }
    })

    const token = await this.generateToken({ 
      id: verifiedUser.id,
      role: verifiedUser.role.role
    })

    return {
      status: true,
      token,
      _id: user.id,
      message: 'Signed up successfully'
    };
  }

  async resendOtp({ email }: ResendOtpDto){
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        isDeleted: false,
        isVerified: false
      }
    })

    if(!user){
      throw new NotFoundException('No such user exist!');
    }

    const expirationDate = this.getExpirationDate();
    const otp = this.generateOtp();

    await this.mailService.sendMail(email, otp);

    const response = await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        otp,
        verificationExpiry: expirationDate
      }
    })

    return {
      status: true,
      message: 'otp successfully resent'
    }
    
  }

}
