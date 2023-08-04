import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user-Dto';
import { JwtService } from '@nestjs/jwt';
import { SigninUserDto } from './dto/signin-user-Dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs'
import { RoleType } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

interface TokenObj {
  id: number;
  role: RoleType
}

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailerService: MailerService
  ){}

  async generateToken(tokenObj: TokenObj){
    return this.jwtService.sign(tokenObj);
  }

  async findUserByEmail(email: string){
    return await this.prisma.user.findUnique({
      where: { email }
    })
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
      throw new ConflictException({
        status: false,
        message: 'User with this email already exist!'
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword
      }
    })

    const role = await this.prisma.role.create({
      data: {
        role: RoleType.USER,
        userId: user.id
      }
    })

    const token = await this.generateToken({ 
      id: user.id,
      role: role.role
    })
    return {
      status: true,
      token,
      _id: user.id,
      message: 'Signed up successfully'
    };
  }

  async signinUser(signinUserDto: SigninUserDto) {
    const { email, password } = signinUserDto;

    const isUserExist = await this.findUserByEmail(email);
    
    if(!isUserExist){
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

  // async sendMail(){
  //   this.mailerService.sendMail({
  //     to: '',
  //     from: '',
  //     subject: 'TESTING',
  //     text: 'here is the otp',
  //     html: '<b>5687</b>'
  //   })
  // }

}
