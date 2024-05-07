import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserService } from './users.service';
import { UsersDto } from './dto/users.dto';

@Controller()
export class UserController {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userService: UserService) {}

  @EventPattern('create_user')
  async createUser(@Payload() data: UsersDto) {
    this.logger.log(`Received user data: ${data}`);

    try {
      const response = await this.userService.create(data);
      return response;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
