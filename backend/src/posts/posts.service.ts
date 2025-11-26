
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument, Post } from './entities/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/schemas/notification.schema';
import { ProfilesService } from 'src/profiles/profiles.service';

@Injectable()
export class PostsService {
  private readonly MILESTONES = [10, 50, 100, 500, 1000];

  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
    private readonly notificationsService: NotificationsService,
    private readonly profilesService: ProfilesService,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    authorId: string,
  ): Promise<PostDocument> {

    const newPost = new this.postModel({
      ...createPostDto,
      authorId: authorId,
      voteScore: 1,
      upvotedBy: [authorId],
      downvotedBy: [],
      commentCount: 0,
    });

    await this.profilesService.addCurrency(authorId, 20);

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

  async toggleUpvote(postId: string, userId: string): Promise<PostDocument> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post no encontrado');

    const isUpvoted = post.upvotedBy.includes(userId);
    const isDownvoted = post.downvotedBy.includes(userId);

    if (isUpvoted) {
      
      post.upvotedBy = post.upvotedBy.filter((id) => id !== userId);
      post.voteScore -= 1;

      await this.profilesService.addCurrency(userId, -20);
    } else {
      
      post.upvotedBy.push(userId);
      post.voteScore += 1;

      if (isDownvoted) {
        
        post.downvotedBy = post.downvotedBy.filter((id) => id !== userId);
        post.voteScore += 1;
      }

      
      await this.profilesService.addCurrency(userId, 20);
      this.checkAndNotifyMilestone(post, userId);
    }

    return post.save();
  }

  async toggleDownvote(postId: string, userId: string): Promise<PostDocument> {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post no encontrado');

    const isUpvoted = post.upvotedBy.includes(userId);
    const isDownvoted = post.downvotedBy.includes(userId);

    if (isDownvoted) {
      post.downvotedBy = post.downvotedBy.filter((id) => id !== userId);
      post.voteScore += 1;
    } else {
      post.downvotedBy.push(userId);
      post.voteScore -= 1;

      if (isUpvoted) {
        post.upvotedBy = post.upvotedBy.filter((id) => id !== userId);
        post.voteScore -= 1;
      }
    }
    
    return post.save();
  }

  private async checkAndNotifyMilestone(post: PostDocument, triggeringUserId: string) {
    
    if (this.MILESTONES.includes(post.voteScore)) {
      await this.notificationsService.create({
        recipientId: post.authorId, 
        triggerUserId: triggeringUserId, 
        type: NotificationType.POST_MILESTONE,
        content: `¡Felicidades! Tu publicación "${post.title}" ha alcanzado los ${post.voteScore} votos.`,
        resourceId: post._id,
        resourceType: 'Post',
      });
    }
  }
}