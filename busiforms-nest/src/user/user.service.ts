import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 간단한 회원가입 or 찾기
  async signInUser(userId: string, role: Role) {
    // find user by id
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      // User already exists, future logic implementation here
      console.log(
        `A registered user logged in with ID: ${user.id} and role: ${user.role}`,
      );
      return user;
    }
    console.log(`A new user registered with ID: ${userId} and role: ${role}`);
    return this.prisma.user.create({
      data: { id: userId, role },
    });
  }

  // 회원정보 수정
  async updateUser(
    id: string,
    data: { name?: string; phone?: string; nickname?: string },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // 회원정보 조회
  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
