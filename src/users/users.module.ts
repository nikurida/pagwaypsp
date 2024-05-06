import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    DatabaseModule,
    RabbitMQModule.register('users_queue', 'USERS_SERVICE'),
  ],
  controllers: [],
  providers: [UserService],
})
export class UsersModule {}
