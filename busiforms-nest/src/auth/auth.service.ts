import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  // 실제로는 비밀번호 검증, JWT 발급 등이 필요.
  async validateUser(email: string) {
    const user = await this.userService.getUserByEmail(email);
    return user;
  }
}
