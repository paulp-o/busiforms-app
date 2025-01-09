import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ResponseService } from './response.service';

@Controller('api/responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  async createResponse(
    @Body('surveyId') surveyId: string,
    @Body('answers') answers: any,
  ) {
    return this.responseService.createResponse(surveyId, answers);
  }

  @Get(':surveyId')
  async getResponses(@Param('surveyId') surveyId: string) {
    return this.responseService.getResponsesBySurvey(surveyId);
  }
}
