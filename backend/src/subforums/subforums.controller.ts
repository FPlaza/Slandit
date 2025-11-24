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

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/join')
  async join(@Param('id') subforumId: string, @Request() req) {
    return this.subforumsService.joinSubforum(subforumId, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/leave')
  async leave(@Param('id') subforumId: string, @Request() req) {
    return this.subforumsService.leaveSubforum(subforumId, req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string){ //agregar Parsers
    return await this.subforumsService.findSubforumById(id);
  }
}
