import { Controller, Logger } from '@nestjs/common';
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
      return {
        status: 'success',
        message: 'User created',
        data: result,
      };
    } catch (e) {
      this.logger.error(e);
      return { status: 'error', message: 'Fail to create user' };
    }
  }
}
