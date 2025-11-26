import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './entities/profile.schema';
import { ProfilesController } from './profiles.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema }
    ]),
    NotificationsModule
  ],
  providers: [ProfilesService],
  exports: [ProfilesService],
  controllers: [ProfilesController],
})
export class ProfilesModule {}
