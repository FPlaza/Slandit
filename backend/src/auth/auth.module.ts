import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { JwtStrategy } from './jwt.strategy';
import { SubforumsModule } from 'src/subforums/subforums.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    UsersModule,
    ProfilesModule,
    SubforumsModule,
    PostsModule,
    
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h', // El token expirará en 1 hora
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}