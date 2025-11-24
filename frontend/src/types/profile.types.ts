import type { SubforumInfo } from "./subforum.types";

export interface Profile {
  _id: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  karma: number;
  currency: number;
  joinedSubforums: SubforumInfo[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthorProfile {
  _id: string;
  username: string;
  avatarUrl?: string;
}

export interface UpdateProfileDto {
  bio?: string;
  avatarUrl?: string;
}