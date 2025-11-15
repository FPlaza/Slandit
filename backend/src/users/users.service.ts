import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entitites/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>
    ) { }

    async createUser(createUserDto: CreateUserDto) {
        const { email, username, password } = createUserDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.usersRepo.create({
            email,
            username,
            passwordHash: hashedPassword
        })

        await this.usersRepo.save(newUser);

        const { passwordHash, ...result } = newUser;

        return result as User;
    }
    findByUsername(username: string) {
        return this.usersRepo.findOne({
            where: { username },
        });
    }

}
