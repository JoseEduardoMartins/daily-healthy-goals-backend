import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('exercises')
@Controller('exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar exercícios (filtrados automaticamente por role/plano do token)' })
  @ApiQuery({ name: 'pain_state_id', required: false, description: 'Filtrar por estado de dor' })
  @ApiResponse({ status: 200, description: 'Lista de exercícios retornada com sucesso' })
  async findAll(
    @Query('pain_state_id') painStateId: string | undefined,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    if (painStateId) {
      return this.exercisesService.findByPainStateId(painStateId, user);
    }
    return this.exercisesService.findAll(user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter exercício por ID' })
  @ApiParam({ name: 'id', description: 'UUID do exercício' })
  @ApiResponse({ status: 200, description: 'Exercício retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Exercício não encontrado' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.exercisesService.findOne(id, user);
  }
}
