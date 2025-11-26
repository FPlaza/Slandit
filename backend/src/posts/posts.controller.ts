import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  Patch
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
  ) {
    const authorId = req.user.id;
    return this.postsService.createPost(createPostDto, authorId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ) {
    return this.postsService.findPostById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/upvote')
  async upvote(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.postsService.toggleUpvote(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/downvote')
  async downvote(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.postsService.toggleDownvote(id, req.user.id);
  }
}