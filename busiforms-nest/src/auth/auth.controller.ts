import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('email') email: string) {
    // 임시로 이메일만 검사
    const user = await this.authService.validateUser(email);
    if (!user) {
      return { error: 'User not found' };
    }
    return { message: 'Login success', user };
  }
}
