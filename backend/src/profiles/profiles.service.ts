import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './entities/profile.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectModel(Profile.name)
        private profileModel: Model<ProfileDocument>,
    ){}

    async findProfileById(id: string): Promise<ProfileDocument> {
        const profile = await this.profileModel.findById(id).exec();

        if (!profile){
            throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
        }

        return profile;
    }
}
