import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ResponseService } from './response.service';

@Controller('api/responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  async createResponse(
    @Body('formId') formId: string,
    @Body('answers') answers: any,
  ) {
    return this.responseService.createResponse(formId, answers);
  }

  @Get(':formId')
  async getResponses(@Param('formId') formId: string) {
    return this.responseService.getResponsesByForm(formId);
  }
}
