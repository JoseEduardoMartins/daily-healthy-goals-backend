import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UserDailyPlanService } from './user-daily-plan.service';
import { UpdateDailyPlanDto } from '../../common/dtos/user-daily-plan/update-daily-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('daily-goals')
@Controller('daily-goals')
@UseGuards(JwtAuthGuard)
export class UserDailyPlanController {
  constructor(
    private readonly userDailyPlanService: UserDailyPlanService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar plano do dia atual do usuário' })
  @ApiResponse({ status: 200, description: 'Plano do dia retornado com sucesso' })
  @ApiResponse({ status: 401, description: 'Autenticação necessária' })
  async findToday(@CurrentUser() user: CurrentUserPayload) {
    if (!user.id) {
      throw new UnauthorizedException('Autenticação necessária');
    }
    return await this.userDailyPlanService.findTodayByUser(user.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar status de item do plano (marcar como concluído/pendente)' })
  @ApiParam({ name: 'id', description: 'UUID do item do plano' })
  @ApiBody({ type: UpdateDailyPlanDto })
  @ApiResponse({ status: 200, description: 'Item do plano atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateDailyPlanDto: UpdateDailyPlanDto,
  ) {
    return await this.userDailyPlanService.update(id, updateDailyPlanDto);
  }
}
