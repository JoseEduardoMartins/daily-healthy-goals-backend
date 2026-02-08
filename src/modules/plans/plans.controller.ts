import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PlansService } from './plans.service';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os planos ativos' })
  @ApiResponse({ status: 200, description: 'Lista de planos retornada com sucesso' })
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter plano por ID' })
  @ApiParam({ name: 'id', description: 'UUID do plano' })
  @ApiResponse({ status: 200, description: 'Plano retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }
}
