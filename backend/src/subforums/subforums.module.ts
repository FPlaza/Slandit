import { Module } from '@nestjs/common';
import { SubforumsService } from './subforums.service';
import { SubforumsController } from './subforums.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subforum, SubforumSchema } from './entities/subforums.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subforum.name, schema: SubforumSchema}
    ])
  ],
  controllers: [SubforumsController],
  providers: [SubforumsService],
  exports: [SubforumsService],
})
export class SubforumsModule {}
