import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiHeader } from '@nestjs/swagger';
import { UserDailyPlanService } from './user-daily-plan.service';
import { UpdateDailyPlanDto } from '../../common/dtos/user-daily-plan/update-daily-plan.dto';
// TODO: Implementar guard de autenticação quando necessário
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('daily-goals')
@Controller('daily-goals')
export class UserDailyPlanController {
  constructor(
    private readonly userDailyPlanService: UserDailyPlanService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar plano do dia atual do usuário' })
  @ApiHeader({ name: 'user-id', required: true, description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Plano do dia retornado com sucesso' })
  @ApiResponse({ status: 400, description: 'User ID é necessário' })
  // @UseGuards(JwtAuthGuard)
  async findToday(@Request() req) {
    const userId = req.headers['user-id'] || req.body.user_id;
    
    if (!userId) {
      throw new BadRequestException('User ID é necessário. Implemente autenticação JWT.');
    }

    return await this.userDailyPlanService.findTodayByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar status de item do plano (marcar como concluído/pendente)' })
  @ApiParam({ name: 'id', description: 'UUID do item do plano' })
  @ApiBody({ type: UpdateDailyPlanDto })
  @ApiResponse({ status: 200, description: 'Item do plano atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  // @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDailyPlanDto: UpdateDailyPlanDto,
  ) {
    return await this.userDailyPlanService.update(id, updateDailyPlanDto);
  }
}
