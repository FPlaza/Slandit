import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
  ) {

    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('Fatal: La variable de entorno JWT_SECRET no está definida.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // <-- Pasamos la variable 'secret' (que ya no es 'undefined')
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username, email: payload.email };
  }
}