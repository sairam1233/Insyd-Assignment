export type NotificationType = 'FOLLOW' | 'LIKE' | 'COMMENT' | 'SHARE_JOB' | 'SHARE_BLOG';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: string;
}
