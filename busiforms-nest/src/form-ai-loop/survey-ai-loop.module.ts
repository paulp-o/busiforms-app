import { Module } from '@nestjs/common';
import { FormAiLoopController } from './form-ai-loop.controller';
import { FormAiLoopService } from './form-ai-loop.service';

@Module({
  controllers: [FormAiLoopController],
  providers: [FormAiLoopService],
})
export class FormAiLoopModule {}
