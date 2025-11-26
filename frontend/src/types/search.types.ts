import type { SubforumInfo } from './subforum.types';
import type { AuthorProfile } from './profile.types';

export interface SearchResults {
  subforums: SubforumInfo[];
  users: AuthorProfile[];
}