import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 간단한 회원가입/로그인
  @Post('register')
  async register(@Body('email') email: string, @Body('name') name?: string) {
    const user = await this.userService.registerUser(email, name);
    return user;
  }

  @Get(':email')
  async getUser(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }
}
