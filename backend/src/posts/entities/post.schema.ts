import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Subforum } from '../../subforums/entities/subforums.schema';
import { Profile } from '../../profiles/entities/profile.schema';

@Schema({ collection: 'posts', timestamps: true })
export class Post {
  @Prop({ required: true, maxlength: 300 })
  title: string;

  @Prop({ required: true })
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
    ref: Subforum.name,
    required: true, 
    index: true 
  })
  subforumId: Subforum; 

  @Prop({ type: Number, default: 0 })
  voteScore: number;

  @Prop({ type: [{ type: String }], default: [] }) 
  upvotedBy: string[]; 

  @Prop({ type: [{ type: String }], default: [] }) 
  downvotedBy: string[];

  @Prop({ type: Number, default: 0 })
  commentCount: number;

}

export const PostSchema = SchemaFactory.createForClass(Post);
export type PostDocument = Post & Document;