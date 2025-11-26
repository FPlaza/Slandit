import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum NotificationType {
  NEW_COMMENT = 'NEW_COMMENT',
  NEW_REPLY = 'NEW_REPLY',
  POST_MILESTONE = 'POST_MILESTONE',
  SUBFORUM_UNLOCKED = 'SUBFORUM_UNLOCKED',
}

@Schema({ collection: 'notifications', timestamps: true })
export class Notification {
  
  @Prop({ required: true })
  type: NotificationType;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ 
    type: String, 
    required: true, 
    index: true
  })
  recipientId: string;

  @Prop({ type: String })
  triggerUserId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  resourceId: MongooseSchema.Types.ObjectId;
  
  @Prop({ type: String })
  resourceType: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
export type NotificationDocument = Notification & Document;