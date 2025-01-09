import { Module } from '@nestjs/common';
import { SurveyAiLoopController } from './survey-ai-loop.controller';
import { SurveyAiLoopService } from './survey-ai-loop.service';

@Module({
  controllers: [SurveyAiLoopController],
  providers: [SurveyAiLoopService],
})
export class SurveyAiLoopModule {}
