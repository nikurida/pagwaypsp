import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { CustomLoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    CustomLoggerModule,
    PassportModule,
    JwtModule.register({
      secret: 'udoXzJEPeTGR9YcH3xYFNRfuGdnlt5pi2bmh5t6bqI0cFMq1XDeiS1NXcgIKmKY',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, PassportModule, JwtStrategy],
})
export class AuthModule {}
