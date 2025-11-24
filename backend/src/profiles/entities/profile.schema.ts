import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Subforum } from '../../subforums/entities/subforums.schema';

@Schema({ collection: 'profiles', timestamps: true})
export class Profile {
  
  @Prop({ type: String })
  _id: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  bio: string;

  @Prop()
  avatarUrl: string;

  @Prop({ default: 0 })
  karma: number;

  @Prop({ default: 0 })
  currency: number;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Subforum.name }]
  })
  joinedSubforums: Subforum[];

}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

export type ProfileDocument = Profile & Document;