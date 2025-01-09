import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 간단한 회원가입 or 찾기
  async registerUser(email: string, name?: string) {
    //  없으면 만들기, 있으면 에러
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) throw new ConflictException('User already exists');
    return this.prisma.user.create({
      data: { email, name },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
