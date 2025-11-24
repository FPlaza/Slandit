// src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument, Post } from './entities/post.schema';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    authorId: string,
  ): Promise<PostDocument> {

    const newPost = new this.postModel({
      ...createPostDto,
      authorId: authorId,
      voteScore: 1,
      upvotedBy: [],
      downvotedBy: [],
      commentCount: 0,
    });

    return newPost.save();
  }

  async findPostById(id: string): Promise<PostDocument> {
    const post = await this.postModel
    .findById(id)
    .populate('authorId', '_id username avatarUrl')
    .populate('subforumId', '_id name displayName')
    .exec();

    if (!post) {
      throw new NotFoundException(`Publicación con ID "${id}" no encontrada`);
    }
    
    return post;
  }
}