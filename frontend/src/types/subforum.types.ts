export interface Subforum {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  administrator: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubforumInfo {
  _id: string;
  name: string;
  displayName: string;
}

export interface CreateSubforumDto {
  name: string;
  displayName: string;
  description?: string;
}