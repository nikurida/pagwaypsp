import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  @Inject('USERS_SERVICE') private usersClient: ClientProxy;
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user = await firstValueFrom(
        this.usersClient.send('find_user', username),
      );

      if (user && user.password === pass) {
        const { password, ...result } = user;
        return result;
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
