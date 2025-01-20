import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '@prisma/client';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signIn')
  async signIn(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.signInUser(
      createUserDto.email,
      createUserDto.userId,
      createUserDto.name,
      createUserDto.accountProvider,
      createUserDto.role as Role,
    );
    return user;
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
