import { Module } from '@nestjs/common';
import { FormAiLoopModule } from './form-ai-loop/survey-ai-loop.module';
import { FormModule } from './form/form.module';
// import { QuestionModule } from './question/question.module';
import { ResponseModule } from './response/response.module';
import { UserModule } from './user/user.module';
// import { AuthModule } from './auth (unused)/auth.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    FormAiLoopModule,
    FormModule,
    // QuestionModule,
    ResponseModule,
    UserModule,
    // AuthModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
