import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias de produtos e exercícios' })
  @ApiResponse({ status: 200, description: 'Lista de categorias retornada com sucesso' })
  findAll() {
    return this.categoriesService.findAll();
  }
}
