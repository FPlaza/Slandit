import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Request, 
  UseGuards, 
  Patch,
  Delete
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req, @Body() createPostDto: CreatePostDto) {
    const authorId = req.user.id;
    return this.postsService.createPost(createPostDto, authorId);
  }

  @Get('hot') // Endpoint: GET /posts/hot
  async getHotPosts() {
    return this.postsService.getHotPosts();
  }

  @Get('recent')
  async findRecent() {
    return this.postsService.findRecent();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('feed') // GET /posts/feed
  async getFeed(@Request() req) {
    return this.postsService.getMyFeed(req.user.id);
  }
  
  @Get('subforum/:subforumId')
  async findBySubforum(@Param('subforumId') subforumId: string) {
    return this.postsService.findPostsBySubforum(subforumId);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.postsService.findPostsByUser(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/upvote')
  async upvote(@Param('id') id: string, @Request() req) {
    return this.postsService.toggleUpvote(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/downvote')
  async downvote(@Param('id') id: string, @Request() req) {
    return this.postsService.toggleDownvote(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.postsService.deletePost(id, req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findPostById(id);
  }

  


}