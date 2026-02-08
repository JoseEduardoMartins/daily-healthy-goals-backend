import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiHeader } from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { UsersService } from '../users/users.service';

@ApiTags('exercises')
@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly exercisesService: ExercisesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar exercícios (filtrados por tipo/plano do usuário)' })
  @ApiQuery({ name: 'pain_state_id', required: false, description: 'Filtrar por estado de dor' })
  @ApiHeader({ name: 'user-id', required: false, description: 'ID do usuário (opcional)' })
  @ApiResponse({ status: 200, description: 'Lista de exercícios retornada com sucesso' })
  async findAll(
    @Query('pain_state_id') painStateId?: string,
    @Request() req?: any,
  ) {
    const user = await this.getUserFromRequest(req);
    
    if (painStateId) {
      return this.exercisesService.findByPainStateId(painStateId, user);
    }
    return this.exercisesService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter exercício por ID' })
  @ApiParam({ name: 'id', description: 'UUID do exercício' })
  @ApiHeader({ name: 'user-id', required: false, description: 'ID do usuário (opcional)' })
  @ApiResponse({ status: 200, description: 'Exercício retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Exercício não encontrado' })
  async findOne(@Param('id') id: string, @Request() req?: any) {
    const user = await this.getUserFromRequest(req);
    return this.exercisesService.findOne(id, user);
  }

  private async getUserFromRequest(req: any) {
    if (!req) return undefined;
    
    const userId = req.headers['user-id'] || req.user?.id;
    if (!userId) return undefined;

    try {
      return await this.usersService.findOne(userId);
    } catch {
      return undefined;
    }
  }
}
