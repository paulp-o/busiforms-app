import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FormService } from './form.service';
import { QuestionType, VisualizationType } from '@prisma/client';

@Controller('api/forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  async createForm(
    @Body('userId') userId: string,
    @Body('title') title: string,
    @Body('description') description?: string,
    @Body('price') price?: number,
    @Body('questions')
    questions?: {
      text: string;
      questionType: QuestionType;
      options: string[];
      visualizationType?: VisualizationType;
    }[],
  ) {
    return this.formService.createForm(
      userId,
      title,
      description,
      price,
      questions,
    );
  }

  @Get()
  async getAllForms() {
    return this.formService.getAllForms();
  }

  @Get('by-user/:userId')
  async getFormsByUser(@Param('userId') userId: string) {
    return this.formService.getFormsByUser(userId);
  }

  @Get(':id')
  async getForm(@Param('id') id: string) {
    return this.formService.getFormById(id);
  }

  @Put(':id')
  async updateForm(
    @Param('id') id: string,
    @Body('price') price?: number,
    @Body('title') title?: string,
    @Body('description') description?: string,
    @Body('questions')
    questions?: {
      id?: string;
      text: string;
      questionType: QuestionType;
      options: string[];
      visualizationType?: VisualizationType;
    }[],
  ) {
    return this.formService.updateForm(
      id,
      title,
      price,
      description,
      questions,
    );
  }

  @Delete(':id')
  async deleteForm(@Param('id') id: string) {
    return this.formService.deleteForm(id);
  }
}
