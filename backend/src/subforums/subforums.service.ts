import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubforumDto } from './dto/create-subforum.dto';
import { UpdateSubforumDto } from './dto/update-subforum.dto';
import { Subforum, SubforumDocument } from './entities/subforums.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SubforumsService {
  constructor(
    @InjectModel(Subforum.name)
    private subforumModel: Model<SubforumDocument>
  ){}

  async createSubforum(adminId: string, createSubforumDto: CreateSubforumDto): Promise<SubforumDocument> {
    const existing = await this.subforumModel.findOne({ name: createSubforumDto.name }).exec();
    
    if (existing) {
      throw new ConflictException(`El nombre "${createSubforumDto.name}" ya está en uso.`);
    }

    const newSubforum = new this.subforumModel({
      ...createSubforumDto,
      administrator: adminId,
      memberCount: 1,
    });

    return newSubforum.save();
  }

  async findSubforumById(id: string): Promise<SubforumDocument>{
    const subforum = await this.subforumModel.findById(id).exec();

    if (!subforum){
      throw new NotFoundException(`Subforo con ID ${id} no encontrado`)
    }

    return subforum;
  }
}
