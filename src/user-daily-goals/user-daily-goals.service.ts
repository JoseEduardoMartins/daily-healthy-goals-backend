import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDailyGoal } from './entities/user-daily-goal.entity';
import { UpdateDailyGoalDto } from './dto/update-daily-goal.dto';
import { GoalLibrary } from '../goal-library/entities/goal-library.entity';
import { DailyCheckinsService } from '../daily-checkins/daily-checkins.service';

@Injectable()
export class UserDailyGoalsService {
  constructor(
    @InjectRepository(UserDailyGoal)
    private userDailyGoalsRepository: Repository<UserDailyGoal>,
    @Inject(forwardRef(() => DailyCheckinsService))
    private dailyCheckinsService: DailyCheckinsService,
  ) {}

  async createGoalsFromLibrary(
    checkinId: string,
    goals: GoalLibrary[],
  ): Promise<UserDailyGoal[]> {
    const userGoals = goals.map((goal) =>
      this.userDailyGoalsRepository.create({
        checkin_id: checkinId,
        goal_library_id: goal.id,
        is_completed: false,
      }),
    );

    return await this.userDailyGoalsRepository.save(userGoals);
  }

  async findTodayByUser(userId: string): Promise<UserDailyGoal[]> {
    const checkin = await this.dailyCheckinsService.findTodayByUser(userId);

    if (!checkin) {
      return [];
    }

    return await this.userDailyGoalsRepository.find({
      where: { checkin_id: checkin.id },
      relations: ['goal_library'],
      order: { id: 'ASC' },
    });
  }

  async update(
    id: string,
    updateDailyGoalDto: UpdateDailyGoalDto,
  ): Promise<UserDailyGoal> {
    const goal = await this.userDailyGoalsRepository.findOne({
      where: { id },
    });

    if (!goal) {
      throw new NotFoundException('Meta não encontrada');
    }

    goal.is_completed = updateDailyGoalDto.is_completed;
    return await this.userDailyGoalsRepository.save(goal);
  }
}
