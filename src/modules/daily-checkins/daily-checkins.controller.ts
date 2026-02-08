import {
  Controller,
  Post,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { DailyCheckinsService } from './daily-checkins.service';
import { CreateDailyCheckinDto } from '../../common/dtos/daily-checkins/create-daily-checkin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('daily-checkins')
@Controller('daily-checkin')
@UseGuards(JwtAuthGuard)
export class DailyCheckinsController {
  constructor(private readonly dailyCheckinsService: DailyCheckinsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar check-in diário e gerar plano automaticamente' })
  @ApiBody({ type: CreateDailyCheckinDto })
  @ApiResponse({ status: 201, description: 'Check-in criado e plano gerado com sucesso' })
  @ApiResponse({ status: 404, description: 'Estado de dor não encontrado' })
  async create(
    @Body() createDailyCheckinDto: CreateDailyCheckinDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return await this.dailyCheckinsService.create(user, createDailyCheckinDto);
  }

  @Delete('today')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resetar check-in do dia atual' })
  @ApiResponse({ status: 204, description: 'Check-in resetado com sucesso' })
  @ApiResponse({ status: 401, description: 'Autenticação necessária' })
  @ApiResponse({ status: 404, description: 'Check-in de hoje não encontrado' })
  async deleteToday(@CurrentUser() user: CurrentUserPayload) {
    if (!user.id) {
      throw new UnauthorizedException('Autenticação necessária');
    }
    await this.dailyCheckinsService.deleteTodayByUser(user.id);
  }
}
