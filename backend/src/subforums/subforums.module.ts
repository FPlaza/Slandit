import { Module } from '@nestjs/common';
import { SubforumsService } from './subforums.service';
import { SubforumsController } from './subforums.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subforum, SubforumSchema } from './entities/subforums.schema';
import { Profile, ProfileSchema } from '../profiles/entities/profile.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subforum.name, schema: SubforumSchema},
      { name: Profile.name, schema: ProfileSchema},
    ]),
    ProfilesModule
  ],
  controllers: [SubforumsController],
  providers: [SubforumsService],
  exports: [SubforumsService],
})
export class SubforumsModule {}
