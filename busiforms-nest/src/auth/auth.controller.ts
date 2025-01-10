import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body('email') email: string) {
    // 임시로 이메일만 검사
    const user = await this.authService.validateUser(email);
    if (!user) {
      // throw relevant error
      throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
    }
    return { message: 'Login success', user };
  }
}

