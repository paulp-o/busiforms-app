import { Controller, Body, Post } from '@nestjs/common';
import { FormAiLoopService } from './survey-ai-loop.service';

@Controller('api/form-ai-loop')
export class FormAiLoopController {
  constructor(private readonly formAiLoopService: FormAiLoopService) {}

  @Post()
  async getFormAiLoop(
    @Body('input') userInput?: string,
    @Body('givenPoll') givenPoll?: string,
  ) {
    return this.formAiLoopService.generatePoll(userInput, givenPoll);
  }

  @Post('inferVisualizationType')
  async inferVisualizationType(@Body('question') question: string) {
    return this.formAiLoopService.inferVisualizationType(question);
  }

  @Post('inferWordCloud')
  async inferWordCloud(@Body('question') question: string) {
    return this.formAiLoopService.inferWordCloud(question);
  }
}
