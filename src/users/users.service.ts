import { Injectable, Logger } from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';
import { User } from './user';
import { EntityManager, Repository } from 'typeorm';
import { Users as UsersEntity } from './entities/users.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async create(userDto: UsersDto): Promise<User> {
    const { password } = userDto;
    const hashedPassword = await this.getBcryptPassword(password);
    const buildedUser = await this.buildUser({
      ...userDto,
      password: hashedPassword,
    });

    try {
      const user = await this.entityManager.transaction(
        async (entityManager) => {
          const savedUser = await entityManager.save(UsersEntity, buildedUser);
          return savedUser;
        },
      );

      return user;
    } catch (e) {
      this.logger.error(e);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { username } });
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
