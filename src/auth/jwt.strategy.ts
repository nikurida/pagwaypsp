import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PinoLogger } from 'nestjs-pino';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { CustomLoggerModule } from 'src/logger/logger.module';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly logger: PinoLogger) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        'udoXzJEPeTGR9YcH3xYFNRfuGdnlt5pi2bmh5t6bqI0cFMq1XDeiS1NXcgIKmKY',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
