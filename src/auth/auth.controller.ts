import { Controller, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly userService: AuthService) {}

  @MessagePattern('login')
  async login(@Payload() data: { username: string; password: string }) {
    this.logger.log(`Logging in user: ${data.username}`);

    try {
      const result = await Promise.race([
        this.userService.login(data),
        new Promise((resolve) => setTimeout(() => resolve(null), 5000)),
      ]);

      this.logger.log(`Result: ${JSON.stringify(result)}`);

      if (!result) {
        throw new HttpException('Fail to login', HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Internal error', HttpStatus.BAD_REQUEST);
    }
  }
}
