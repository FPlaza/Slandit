import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ProfilesService } from 'src/profiles/profiles.service';
import * as bcrypt from 'bcrypt';
import { SubforumsService } from 'src/subforums/subforums.service';

const SLANDIT_SUBFORUM_ID = '6924f32241770dc7a6f0f64b';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly profilesService: ProfilesService,
    private readonly subforumsService: SubforumsService,
  ) { }

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(createUserDto);

    await this.profilesService.createProfile(
      newUser.id,
      newUser.username,
    );

    try {
      await this.subforumsService.joinSubforum(SLANDIT_SUBFORUM_ID, newUser.id);
    } catch (error) {
      console.warn(`No se pudo unir al usuario al subforo default: ${error.message}`);
    }

    const payload = {
      sub: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: newUser,
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user,
    };
  }
}
