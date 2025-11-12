import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { SubforumsService } from './subforums.service';
import { CreateSubforumDto } from './dto/create-subforum.dto';
import { UpdateSubforumDto } from './dto/update-subforum.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('subforums')
export class SubforumsController {
  constructor(private readonly subforumsService: SubforumsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createSubforum(
    @Request() req,
    @Body() createSubforumDto: CreateSubforumDto
  ) {
    return await this.subforumsService.createSubforum(req.user.id ,createSubforumDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string){ //agregar Parsers
    return await this.subforumsService.findSubforumById(id);
  }
}
