import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(data: any) {
    const newNotification = new this.notificationModel(data);
    return newNotification.save();
  }

  async findMyNotifications(userId: string) {
    return this.notificationModel.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
  }
  
  async getUnreadCount(userId: string) {
      return this.notificationModel.countDocuments({ 
          recipientId: userId, 
          read: false 
      });
  }
}