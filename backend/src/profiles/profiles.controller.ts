import { Controller, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
    constructor(
        private readonly profilesService: ProfilesService
    ){}

    @Get(':id')
    async findOne(@Param('id') id: string){
        return this.profilesService.findProfileById(id);
    }
}
