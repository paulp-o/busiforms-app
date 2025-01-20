import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [FormController],
  providers: [FormService, PrismaService],
})
export class FormModule {}
