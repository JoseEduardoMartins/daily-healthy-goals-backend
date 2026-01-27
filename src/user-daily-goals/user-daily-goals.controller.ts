import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { UserDailyGoalsService } from './user-daily-goals.service';
import { UpdateDailyGoalDto } from './dto/update-daily-goal.dto';
// TODO: Implementar guard de autenticação quando necessário
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('daily-goals')
export class UserDailyGoalsController {
  constructor(
    private readonly userDailyGoalsService: UserDailyGoalsService,
  ) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findToday(@Request() req) {
    const userId = req.headers['user-id'] || req.body.user_id;
    
    if (!userId) {
      throw new BadRequestException('User ID é necessário. Implemente autenticação JWT.');
    }

    return await this.userDailyGoalsService.findTodayByUser(userId);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDailyGoalDto: UpdateDailyGoalDto,
  ) {
    return await this.userDailyGoalsService.update(id, updateDailyGoalDto);
  }
}
