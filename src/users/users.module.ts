import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLoggerModule } from 'src/logger/logger.module';
import { UserController } from './user.controller';
import { Users } from './entities/users.entity';

@Module({
  imports: [
    CustomLoggerModule,
    TypeOrmModule.forFeature([Users]),
    DatabaseModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
