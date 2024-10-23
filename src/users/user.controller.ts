import { Controller, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './users.service';
import { UsersDto } from './dto/users.dto';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userService: UserService) {}

  @MessagePattern('create_user')
  async createUser(@Payload() data: UsersDto) {
    this.logger.log(`Received user data: ${data}`);

    try {
      const result = await this.userService.create(data);

      if (result) {
        return result;
      }

      throw new HttpException('Fail to create user', HttpStatus.BAD_REQUEST);
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Internal error', HttpStatus.BAD_REQUEST);
    }
  }

  @MessagePattern('find_user')
  async findUserByUsername(@Payload() username: string) {
    this.logger.log(`Finding user by username: ${username}`);

    try {
      const result = await this.userService.findByUsername(username);

      if (result) {
        return result;
      }

      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Internal error', HttpStatus.BAD_REQUEST);
    }
  }
}
