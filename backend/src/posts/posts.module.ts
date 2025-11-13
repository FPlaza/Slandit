import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './entities/post.schema';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { SubforumsModule } from 'src/subforums/subforums.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
    ]),
    
    ProfilesModule,
    SubforumsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService], 
})
export class PostsModule {}