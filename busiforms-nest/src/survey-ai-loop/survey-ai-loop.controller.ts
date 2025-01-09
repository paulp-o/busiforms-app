import { Controller, Get, Body } from '@nestjs/common';
import { SurveyAiLoopService } from './survey-ai-loop.service';

@Controller('api/survey-ai-loop')
export class SurveyAiLoopController {
  constructor(private readonly surveyAiLoopService: SurveyAiLoopService) {}

  @Get()
  async getSurveyAiLoop(
    @Body('input') userInput?: string,
    @Body('givenPoll') givenPoll?: string,
  ) {
    return this.surveyAiLoopService.generatePoll(userInput, givenPoll);
  }
}
