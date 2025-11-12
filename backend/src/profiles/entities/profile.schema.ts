import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

export type ProfileDocument = Profile & Document;