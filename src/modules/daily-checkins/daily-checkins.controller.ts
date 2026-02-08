import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';
import { DailyCheckinsService } from './daily-checkins.service';
import { CreateDailyCheckinDto } from '../../common/dtos/daily-checkins/create-daily-checkin.dto';
// TODO: Implementar guard de autenticação quando necessário
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('daily-checkins')
@Controller('daily-checkin')
export class DailyCheckinsController {
  constructor(private readonly dailyCheckinsService: DailyCheckinsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar check-in diário e gerar plano automaticamente' })
  @ApiBody({ type: CreateDailyCheckinDto })
  @ApiHeader({ name: 'user-id', required: true, description: 'ID do usuário' })
  @ApiResponse({ status: 201, description: 'Check-in criado e plano gerado com sucesso' })
  @ApiResponse({ status: 400, description: 'User ID é necessário' })
  @ApiResponse({ status: 404, description: 'Estado de dor não encontrado' })
  // @UseGuards(JwtAuthGuard) // TODO: Adicionar quando autenticação estiver pronta
  async create(@Body() createDailyCheckinDto: CreateDailyCheckinDto, @Request() req) {
    // TODO: Obter user do token JWT quando autenticação estiver pronta
    // Por enquanto, vamos usar um user_id temporário do body ou header
    // Para desenvolvimento, vamos assumir que o user_id vem no header ou body
    const userId = req.headers['user-id'] || req.body.user_id;
    
    if (!userId) {
      throw new BadRequestException('User ID é necessário. Implemente autenticação JWT.');
    }

    // Criar um objeto user temporário
    const user = { id: userId } as any;
    
    return await this.dailyCheckinsService.create(user, createDailyCheckinDto);
  }

  @Delete('today')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Resetar check-in do dia atual' })
  @ApiHeader({ name: 'user-id', required: true, description: 'ID do usuário' })
  @ApiResponse({ status: 204, description: 'Check-in resetado com sucesso' })
  @ApiResponse({ status: 400, description: 'User ID é necessário' })
  @ApiResponse({ status: 404, description: 'Check-in de hoje não encontrado' })
  // @UseGuards(JwtAuthGuard)
  async deleteToday(@Request() req) {
    const userId = req.headers['user-id'] || req.body.user_id;
    
    if (!userId) {
      throw new BadRequestException('User ID é necessário. Implemente autenticação JWT.');
    }

    await this.dailyCheckinsService.deleteTodayByUser(userId);
  }
}
