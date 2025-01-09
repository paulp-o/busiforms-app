import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ResponseService {
  constructor(private prisma: PrismaService) {}

  async createResponse(surveyId: string, answers: any) {
    return this.prisma.response.create({
      data: {
        surveyId,
        answers,
      },
    });
  }

  async getResponsesBySurvey(surveyId: string) {
    return this.prisma.response.findMany({
      where: { surveyId },
    });
  }
}
