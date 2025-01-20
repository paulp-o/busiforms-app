import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 간단한 회원가입 or 찾기
  async signInUser(
    email: string,
    userId: string,
    name: string,
    accountProvider: string,
    role: Role,
  ) {
    // find user by id
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      // User already exists, future logic implementation here
      console.log(
        `A registered user logged in with ID: ${user.id} and email: ${user.email} with provider: ${user.accountProvider}`,
      );
      return user;
    }
    console.log(
      `A new user registered with ID: ${userId} and email: ${email} with provider: ${accountProvider}`,
    );
    return this.prisma.user.create({
      data: { email, id: userId, name, role, accountProvider },
    });
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
