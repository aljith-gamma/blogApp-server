import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";


@Module({
    imports: [PrismaModule, CloudinaryModule],
    controllers: [ProfileController],
    providers: [ProfileService]
})

export class ProfileModule {};