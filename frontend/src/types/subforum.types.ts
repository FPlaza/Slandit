export interface Subforum {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  banner?: string;
  administrator: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubforumInfo {
  _id: string;
  name: string;
  displayName: string;
  icon?: string;
  banner?: string;
}

export interface CreateSubforumDto {
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  banner?: string;
}