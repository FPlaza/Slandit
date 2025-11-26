export type NotificationType = 
  | 'NEW_COMMENT'
  | 'NEW_REPLY'
  | 'POST_MILESTONE'
  | 'SUBFORUM_UNLOCKED'
  | 'WELCOME';

export interface Notification {
  _id: string;
  type: NotificationType;
  content: string;
  read: boolean;
  recipientId: string;
  triggerUserId?: string;
  resourceId?: string;
  resourceType?: string;
  createdAt: string;
  updatedAt: string;
}