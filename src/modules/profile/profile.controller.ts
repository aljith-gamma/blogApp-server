import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService){};

    @Get(':id')
    public async getProfile(
        @Req() { user },
        @Param('id', ParseIntPipe) id: number
    ){
        return this.profileService.getProfile(user, id);
    }

    @Post('update')
    @UseInterceptors(FileInterceptor('avatar'))
    public async updateProfile(
        @UploadedFile() file : Express.Multer.File,
        @Req() { user },
        @Body() updateProfileDto: UpdateProfileDto
    ){
        return this.profileService.updateProfile(user, file, updateProfileDto);
    }
}
