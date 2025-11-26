import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Post, PostDocument } from '../posts/entities/post.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { ProfilesService } from 'src/profiles/profiles.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly notificationsService: NotificationsService,
    private readonly profilesService: ProfilesService,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<CommentDocument> {

    
    const post = await this.postModel.findById(createCommentDto.postId);
    if (!post) throw new NotFoundException('El post no existe');

    
    const newComment = new this.commentModel({
      ...createCommentDto,
      authorId: userId,
      voteScore: 0,
    });
    const savedComment = await newComment.save();

    
    await this.postModel.findByIdAndUpdate(createCommentDto.postId, {
      $inc: { commentCount: 1 }
    });

    

    
    if (createCommentDto.parentId) {
      
      const parentComment = await this.commentModel.findById(createCommentDto.parentId);

      
      if (parentComment && parentComment.authorId !== userId) {
        await this.notificationsService.create({
          recipientId: parentComment.authorId, 
          triggerUserId: userId,
          type: 'NEW_REPLY', 
          content: `Alguien respondió a tu comentario en: "${post.title}"`,
          resourceId: post._id, 
          resourceType: 'Post'
        });
      }
    }
    
    else {
      
      if (post.authorId !== userId) {
        await this.notificationsService.create({
          recipientId: post.authorId, 
          triggerUserId: userId,
          type: 'NEW_COMMENT', 
          content: `Alguien comentó en tu publicación: "${post.title}"`,
          resourceId: post._id,
          resourceType: 'Post'
        });
      }
    }

    await this.profilesService.addCurrency(userId, 20);

    return savedComment;
  }

  async findByPostId(postId: string) {
    return this.commentModel.find({ postId })
      .populate('authorId', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .exec();
  }
}