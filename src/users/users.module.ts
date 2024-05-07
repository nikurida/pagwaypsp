import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { UsersRepository } from './repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    CustomLoggerModule,
    TypeOrmModule.forFeature([UsersRepository]),
    DatabaseModule,
  ],
  controllers: [],
  providers: [UserService],
})
export class UsersModule {}
