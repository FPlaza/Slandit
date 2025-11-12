import { Body, Controller, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('profiles')
export class ProfilesController {
    constructor(
        private readonly profilesService: ProfilesService
    ){}

    @Get(':id')
    async findOne(@Param('id') id: string){
        return await this.profilesService.findProfileById(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('me')
    async updateMyProfile(
        @Request() req,
        @Body() updateProfileDto: UpdateProfileDto,
    ){
        return await this.profilesService.updateProfile(req.user.id, updateProfileDto);
    }
}
