import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './repositories/user.repository';
import { User } from './user';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UsersRepository,
    @Inject('USERS_SERVICE') private readonly client: ClientProxy,
  ) {}

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

      this.client.emit('user_created', user);

      return user;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  private async buildUser(user: UsersDto) {
    try {
      const buildedUser = await this.userRepository.create(user);
      return buildedUser;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  private async getBcryptPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt();
      return await bcrypt.hash(password, salt);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
