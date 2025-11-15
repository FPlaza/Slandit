import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './entities/profile.schema';
import { Model } from 'mongoose';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Types } from 'mongoose';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectModel(Profile.name)
        private profileModel: Model<ProfileDocument>,
    ) { }

    async findProfileById(id: string): Promise<ProfileDocument> {
        const profile = await this.profileModel.findById(id).exec();

        if (!profile) {
            throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
        }

        return profile;
    }

    async createProfile(userId: string, username: string): Promise<ProfileDocument> {
        const newProfile = new this.profileModel({
            _id: userId,
            username: username,
            bio: '',
            avatarUrl: '',
            karma: 0,
            currency: 50
        });

        return newProfile.save();
    }

    async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<ProfileDocument> {

        const updatedProfile = await this.profileModel.findByIdAndUpdate(
            id,
            { $set: updateProfileDto },
            { new: true },
        ).exec();

        if (!updatedProfile) {
            throw new NotFoundException(`Perfil con ID ${id} no encontrado`)
        }

        return updatedProfile;
    }

    async findById(id: string) {
        return this.profileModel.findOne({ _id: id }).exec();
    }
}
