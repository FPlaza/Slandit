import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Post, PostDocument } from '../posts/entities/post.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<CommentDocument> {
    
    const postExists = await this.postModel.exists({ _id: createCommentDto.postId });
    if (!postExists) {
      throw new NotFoundException('El post no existe');
    }

    const newComment = new this.commentModel({
      ...createCommentDto,
      authorId: userId,
      voteScore: 0,
    });
    const savedComment = await newComment.save();

    await this.postModel.findByIdAndUpdate(createCommentDto.postId, {
      $inc: { commentCount: 1 } 
    });

    return savedComment;
  }

  async findByPostId(postId: string) {
    return this.commentModel.find({ postId })
      .populate('authorId', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .exec();
  }
}