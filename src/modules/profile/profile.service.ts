import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";


@Injectable()
export class ProfileService {
    constructor( 
        private prisma: PrismaService,
        private cloudinaryService: CloudinaryService
    ) {};

    async getProfile(user, userId: number) {
        let id = user.id;
        if(userId) id = userId;

        const profile = await this.prisma.profile.findUnique({
            where: { userId: id },
            include: {
                user: true
            }
        })
        let userData = user;

        if(userId) {
            userData = await this.prisma.user.findUnique({
                where: {
                    id: userId 
                }
            })
        }

        if(!userData){
            throw new NotFoundException('No such user exist!');
        }
        
        return {
            userId,
            ...profile,
            user: user.id,
            userName: userData.userName,
            followersCount: userData.followersCount
        };
    }

    async updateProfile(user, file: Express.Multer.File, updateProfileDto: UpdateProfileDto) {
        const { userName, firstName, lastName, bio } = updateProfileDto;

        let url;
        if(file){
            const res = await this.cloudinaryService.uploadImage(file);
            const { secure_url } = res;
            url = secure_url;
        }

        const isUserNameExist = await this.prisma.user.findFirst({
            where: {
                userName,
                NOT: {
                    id: user.id
                }
            }
        })

        if(isUserNameExist){
            throw new ConflictException('username not available!')
        }

        const updatedUserName = await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                userName
            }
        })

        const data = {
            firstName,
            lastName,
            bio,
            ...(url && { avatarUrl: url }),
            userId: user.id
        }

        const updatedProfile = await this.prisma.profile.upsert({
            where: {
                userId: user.id
            },
            create: data,
            update: data
        })

        return {
            status: true,
            message: 'Profile updated successfully'
        }
    }
}