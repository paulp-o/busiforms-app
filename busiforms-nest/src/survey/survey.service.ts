import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
// QuestionType, VisualizationType이 필요하다면 @prisma/client에서 import
import { QuestionType, VisualizationType } from '@prisma/client';

@Injectable()
export class SurveyService {
  constructor(private prisma: PrismaService) {}

  private validatePrice(price?: number) {
    if (price !== undefined && (price < 0 || !Number.isFinite(price))) {
      throw new BadRequestException('Price must be a non-negative number');
    }
  }

  // 설문 + 질문 동시 생성
  async createSurvey(
    userId: string,
    title: string,
    description?: string,
    price?: number,
    questions?: {
      text: string;
      questionType: QuestionType;
      options: string[];
      visualizationType?: VisualizationType;
    }[],
  ) {
    this.validatePrice(price);
    return this.prisma.survey.create({
      data: {
        userId,
        title,
        description,
        price,
        // questions가 넘어왔다면 nested create로 한 번에 생성
        questions: questions
          ? {
              create: questions.map((q) => ({
                text: q.text,
                questionType: q.questionType,
                options: q.options,
                visualizationType: q.visualizationType || 'bar_chart',
              })),
            }
          : undefined,
      },
      include: { questions: true }, // 생성 후 questions까지 반환
    });
  }

  // 설문 전체 조회
  async getAllSurveys() {
    return this.prisma.survey.findMany();
  }

  // 특정 사용자 설문 조회
  async getSurveysByUser(userId: string) {
    return this.prisma.survey.findMany({
      where: { userId },
      include: { questions: true },
    });
  }

  // 특정 설문 조회
  async getSurveyById(id: string) {
    return this.prisma.survey.findUnique({
      where: { id },
      include: { questions: true },
    });
  }

  // 설문 수정 (questions까지 같이 수정하고 싶다면 nested update 사용)
  async updateSurvey(
    id: string,
    title?: string,
    price?: number,
    description?: string,
    questions?: {
      id?: string; // 이미 존재하는 질문이면 id가 있을 수도
      text: string;
      questionType: QuestionType;
      options: string[];
      visualizationType?: VisualizationType;
    }[],
  ) {
    this.validatePrice(price);
    return this.prisma.survey.update({
      where: { id },
      data: {
        title,
        description,
        price,

        // 아래는 단순 예시: 기존 질문 전부 지우고 새로 만든다든지,
        // or upsert를 사용해 수정·생성을 구분할 수도 있음.
        ...(questions && {
          questions: {
            deleteMany: {}, // 우선 모든 questions 삭제
            create: questions.map((q) => ({
              text: q.text,
              questionType: q.questionType,
              options: q.options,
              visualizationType: q.visualizationType || 'bar_chart',
            })),
          },
        }),
      },
      include: { questions: true },
    });
  }

  // 설문 삭제
  async deleteSurvey(id: string) {
    await this.prisma.question.deleteMany({
      where: { surveyId: id },
    });
    return this.prisma.survey.delete({
      where: { id },
    });
  }
}
