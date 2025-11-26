import type { AuthorProfile } from './profile.types';

export interface Comment {
  _id: string;
  content: string;
  authorId: AuthorProfile; 
  postId: string; 
  parentId: string | null; 
  voteScore: number;
  upvotedBy: string[];
  downvotedBy: string[];
  createdAt: string;
  updatedAt: string;
  children?: Comment[]; 
}

export interface CreateCommentDto {
  content: string;
  postId: string;
  parentId?: string;
}