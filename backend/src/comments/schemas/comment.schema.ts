import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Profile } from '../../profiles/entities/profile.schema';
import { Post } from '../../posts/entities/post.schema';

@Schema({ collection: 'comments', timestamps: true })
export class Comment {
  
  @Prop({ required: true, maxlength: 1000 })
  content: string;

  @Prop({ 
    type: String, 
    ref: Profile.name, 
    required: true,
    index: true 
  })
  authorId: string; 

  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: Post.name, 
    required: true,
    index: true 
  })
  postId: Post; 

  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: 'Comment',
    default: null,
    index: true 
  })
  parentId: MongooseSchema.Types.ObjectId; 

  @Prop({ type: Number, default: 0 })
  voteScore: number;

  @Prop({ type: [{ type: String }], default: [] })
  upvotedBy: string[];

  @Prop({ type: [{ type: String }], default: [] })
  downvotedBy: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
export type CommentDocument = Comment & Document;