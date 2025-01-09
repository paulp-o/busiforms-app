import { Controller, Body, Post } from '@nestjs/common';
import { SurveyAiLoopService } from './survey-ai-loop.service';

@Controller('api/survey-ai-loop')
export class SurveyAiLoopController {
  constructor(private readonly surveyAiLoopService: SurveyAiLoopService) {}

  @Post()
  async getSurveyAiLoop(
    @Body('input') userInput?: string,
    @Body('givenPoll') givenPoll?: string,
  ) {
    return this.surveyAiLoopService.generatePoll(userInput, givenPoll);
  }

  @Post('inferVisualizationType')
  async inferVisualizationType(@Body('question') question: string) {
    return this.surveyAiLoopService.inferVisualizationType(question);
  }
}
