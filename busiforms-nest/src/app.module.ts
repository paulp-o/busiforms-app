import { Module } from '@nestjs/common';
import { SurveyAiLoopModule } from './survey-ai-loop/survey-ai-loop.module';
import { SurveyModule } from './survey/survey.module';
// import { QuestionModule } from './question/question.module';
import { ResponseModule } from './response/response.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    SurveyAiLoopModule,
    SurveyModule,
    // QuestionModule,
    ResponseModule,
    UserModule,
    AuthModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
