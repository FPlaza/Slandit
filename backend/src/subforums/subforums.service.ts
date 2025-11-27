import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubforumDto } from './dto/create-subforum.dto';
import { UpdateSubforumDto } from './dto/update-subforum.dto';
import { Subforum, SubforumDocument } from './entities/subforums.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../profiles/entities/profile.schema';
import { ProfilesService } from 'src/profiles/profiles.service';

@Injectable()
export class SubforumsService {
  constructor(
    @InjectModel(Subforum.name)
    private subforumModel: Model<SubforumDocument>,
    @InjectModel(Profile.name)
    private profileModel: Model<ProfileDocument>,
    private readonly profilesService: ProfilesService,
  ){}

  async createSubforum(adminId: string, createSubforumDto: CreateSubforumDto): Promise<SubforumDocument> {
    const profile = await this.profileModel.findById(adminId);
    if (!profile) throw new NotFoundException('Perfil no encontrado');

    if (profile.currency < 500) {
        throw new ConflictException('No tienes suficientes monedas (500) para crear un subforo.');
    }
    
    const existing = await this.subforumModel.findOne({ name: createSubforumDto.name }).exec();
    
    if (existing) {
      throw new ConflictException(`El nombre "${createSubforumDto.name}" ya está en uso.`);
    }

    await this.profilesService.addCurrency(adminId, -500);

    const newSubforum = new this.subforumModel({
      ...createSubforumDto,
      administrator: adminId,
      memberCount: 1,
    });
    await newSubforum.save();

    await this.profileModel.findByIdAndUpdate(adminId, {
      $addToSet: { joinedSubforums: newSubforum._id }
    });

    return newSubforum;
  }

  async findSubforumById(id: string): Promise<SubforumDocument>{
    const subforum = await this.subforumModel.findById(id).exec();

    if (!subforum){
      throw new NotFoundException(`Subforo con ID ${id} no encontrado`)
    }

    return subforum;
  }

  async joinSubforum(subforumId: string, userId: string) {
    const subforumExists = await this.subforumModel.exists({ _id: subforumId });
    if (!subforumExists) throw new NotFoundException('Subforo no encontrado');

    const userProfile = await this.profileModel.findByIdAndUpdate(userId, {
      $addToSet: { joinedSubforums: subforumId } 
    });

    if (!userProfile) {
      throw new NotFoundException('Perfil de usuario no encontrado');
    }

    const wasAlreadyJoined = (userProfile.joinedSubforums || []).some(
      (id) => id.toString() === subforumId.toString()
    );

    if (!wasAlreadyJoined) {
       await this.subforumModel.findByIdAndUpdate(subforumId, {
         $inc: { memberCount: 1 }
       });
    }

    return { message: 'Te has unido al subforo' };
  }

  async leaveSubforum(subforumId: string, userId: string) {
     await this.profileModel.findByIdAndUpdate(userId, {
       $pull: { joinedSubforums: subforumId }
     });
     
     await this.subforumModel.findByIdAndUpdate(subforumId, {
        $inc: { memberCount: -1 }
     });
     
     return { message: 'Has salido del subforo' };
  }

  async search(query: string) {
    return this.subforumModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } }
      ]
    })
    .select('name displayName icon memberCount')
    .limit(5)
    .exec();
  }
}
