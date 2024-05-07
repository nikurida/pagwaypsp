import { Injectable, Logger } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './repositories/user.repository';
import { User } from './user';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private userRepository: UsersRepository) {}

  async create(userDto: UsersDto): Promise<User> {
    const { password } = userDto;

    const hashedPassword = await this.getBcryptPassword(password);

    const buildedUser = await this.buildUser({
      ...userDto,
      password: hashedPassword,
    });

    try {
      const user = await this.userRepository.dataSource.transaction(
        async (entityManager) => {
          const savedUser = await entityManager.save(buildedUser);
          return savedUser;
        },
      );

      return user;
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async buildUser(user: UsersDto) {
    try {
      const buildedUser = await this.userRepository.create(user);
      return buildedUser;
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async getBcryptPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt();
      return await bcrypt.hash(password, salt);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
