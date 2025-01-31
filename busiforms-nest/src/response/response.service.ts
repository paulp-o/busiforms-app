import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ResponseService {
  constructor(private prisma: PrismaService) {}

  async createResponse(formId: string, answers: any) {
    return this.prisma.response.create({
      data: {
        formId,
        answers,
      },
    });
  }

  async getResponsesByForm(formId: string) {
    return this.prisma.response.findMany({
      where: { formId },
    });
  }
}
