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
import { DailyCheckinsService } from './daily-checkins.service';
import { CreateDailyCheckinDto } from './dto/create-daily-checkin.dto';
// TODO: Implementar guard de autenticação quando necessário
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('daily-checkin')
export class DailyCheckinsController {
  constructor(private readonly dailyCheckinsService: DailyCheckinsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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
  // @UseGuards(JwtAuthGuard)
  async deleteToday(@Request() req) {
    const userId = req.headers['user-id'] || req.body.user_id;
    
    if (!userId) {
      throw new BadRequestException('User ID é necessário. Implemente autenticação JWT.');
    }

    await this.dailyCheckinsService.deleteTodayByUser(userId);
  }
}
