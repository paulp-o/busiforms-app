import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ResponseController } from './response.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [ResponseController],
  providers: [ResponseService, PrismaService],
})
export class ResponseModule {}
