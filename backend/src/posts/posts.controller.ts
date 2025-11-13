// src/posts/posts.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Request, 
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
    @Param('id') id: string, // agregar Parser
  ) {
    return this.postsService.findPostById(id);
  }
}