import { Injectable } from '@nestjs/common';
import { SubforumsService } from '../subforums/subforums.service';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly subforumsService: SubforumsService,
    private readonly profilesService: ProfilesService,
  ) {}

  async searchAll(query: string) {
    const [subforums, users] = await Promise.all([
      this.subforumsService.search(query),
      this.profilesService.search(query),
    ]);

    return {
      subforums,
      users,
    };
  }
}