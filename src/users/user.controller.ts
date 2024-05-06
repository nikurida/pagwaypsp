import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './users.service';
import { UsersDto } from './dto/users.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ role: 'user', cmd: 'create' })
  async createUser(@Payload() data: UsersDto) {
    console.log(`Received user data: ${data}`);

    return this.userService.create(data);
  }
}
