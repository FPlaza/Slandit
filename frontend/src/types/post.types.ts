import type { AuthorProfile } from "./profile.types";
import type { SubforumInfo } from "./subforum.types";

export interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: AuthorProfile;
  subforumId: SubforumInfo;
  voteScore: number;
  upvotedBy: string[];
  downvotedBy: string[];
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  subforumId: string;
}