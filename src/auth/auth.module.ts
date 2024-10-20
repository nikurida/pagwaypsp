import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CustomLoggerModule } from 'src/logger/logger.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    CustomLoggerModule,
    PassportModule,
    JwtModule.register({
      secret: 'udoXzJEPeTGR9YcH3xYFNRfuGdnlt5pi2bmh5t6bqI0cFMq1XDeiS1NXcgIKmKY',
      signOptions: { expiresIn: '60s' },
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [JwtStrategy, AuthService],
  exports: [JwtModule, PassportModule, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
