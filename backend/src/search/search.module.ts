import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { SubforumsModule } from '../subforums/subforums.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    SubforumsModule,
    ProfilesModule
  ],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}