import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ collection: 'profiles' })
export class Profile {
    @Prop({ required: true })
    userId: string;

    @Prop()
    bio: string;

    @Prop()
    avatarUrl: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
