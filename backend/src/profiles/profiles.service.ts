import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './entities/profile.schema';
import { Model } from 'mongoose';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/schemas/notification.schema';

@Injectable()
export class ProfilesService {
    private readonly SUBFORUM_COST = 500;

    constructor(
        @InjectModel(Profile.name)
        private profileModel: Model<ProfileDocument>,
        private readonly notificationsService: NotificationsService,
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

    async findMyProfileWithSubforums(id: string): Promise<ProfileDocument> {
        const profile = await this.profileModel.findById(id)
            .populate({
                path: 'joinedSubforums',
                select: 'name displayName icon banner'
            })
            .exec();

        if (!profile) throw new NotFoundException();

        return profile;
    }

    async findProfileByUsername(username: string): Promise<ProfileDocument> {
        const profile = await this.profileModel.findOne({ username }).exec();

        if (!profile) {
            throw new NotFoundException(`Perfil con username ${username} no encontrado`);
        }

        return profile;
    }

    async addCurrency(userId: string, amount: number): Promise<ProfileDocument> {
    const profile = await this.profileModel.findById(userId);
    
    if (!profile) throw new NotFoundException('Perfil no encontrado');

    const previousCurrency = profile.currency;
    const newCurrency = previousCurrency + amount;

    
    profile.currency = newCurrency;

    
    
    
    if (previousCurrency < this.SUBFORUM_COST && newCurrency >= this.SUBFORUM_COST) {
      
      await this.notificationsService.create({
        recipientId: userId,
        triggerUserId: null, 
        type: NotificationType.SUBFORUM_UNLOCKED,
        content: `¡Felicidades! Has alcanzado ${newCurrency} monedas. Ahora tienes permiso para crear tus propios Subforos.`,
        resourceId: null, 
        resourceType: 'System'
      });
    }

    return profile.save();
  }

  async getJoinedSubforumsIds(userId: string): Promise<any[]> {
    const profile = await this.profileModel.findById(userId).exec();
    if (!profile) throw new NotFoundException('Perfil no encontrado');
    
    return profile.joinedSubforums || [];
  }
}