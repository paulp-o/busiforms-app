import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { QuestionType, VisualizationType } from '@prisma/client';

@Controller('api/surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  async createSurvey(
    @Body('userId') userId: string,
    @Body('title') title: string,
    @Body('description') description?: string,
    @Body('price') price?: number,
    @Body('questions')
    questions?: {
      text: string;
      questionType: QuestionType;
      options: string[];
      visualizationType?: VisualizationType;
    }[],
  ) {
    return this.surveyService.createSurvey(
      userId,
      title,
      description,
      price,
      questions,
    );
  }

  @Get()
  async getAllSurveys() {
    return this.surveyService.getAllSurveys();
  }

  @Get('by-user/:userId')
  async getSurveysByUser(@Param('userId') userId: string) {
    return this.surveyService.getSurveysByUser(userId);
  }

  @Get(':id')
  async getSurvey(@Param('id') id: string) {
    return this.surveyService.getSurveyById(id);
  }

  @Put(':id')
  async updateSurvey(
    @Param('id') id: string,
    @Body('price') price?: number,
    @Body('title') title?: string,
    @Body('description') description?: string,
    @Body('questions')
    questions?: {
      id?: string;
      text: string;
      questionType: QuestionType;
      options: string[];
      visualizationType?: VisualizationType;
    }[],
  ) {
    return this.surveyService.updateSurvey(
      id,
      title,
      price,
      description,
      questions,
    );
  }

  @Delete(':id')
  async deleteSurvey(@Param('id') id: string) {
    return this.surveyService.deleteSurvey(id);
  }
}
