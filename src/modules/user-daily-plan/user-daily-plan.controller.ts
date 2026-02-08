import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { UserDailyPlanService } from './user-daily-plan.service';
import { UpdateDailyPlanDto } from '../../common/dtos/user-daily-plan/update-daily-plan.dto';
// TODO: Implementar guard de autenticação quando necessário
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('daily-goals')
export class UserDailyPlanController {
  constructor(
    private readonly userDailyPlanService: UserDailyPlanService,
  ) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findToday(@Request() req) {
    const userId = req.headers['user-id'] || req.body.user_id;
    
    if (!userId) {
      throw new BadRequestException('User ID é necessário. Implemente autenticação JWT.');
    }

    return await this.userDailyPlanService.findTodayByUser(userId);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDailyPlanDto: UpdateDailyPlanDto,
  ) {
    return await this.userDailyPlanService.update(id, updateDailyPlanDto);
  }
}
