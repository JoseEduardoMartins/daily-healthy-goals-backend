import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalLibraryService } from './goal-library.service';
import { GoalLibrary } from './entities/goal-library.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoalLibrary])],
  providers: [GoalLibraryService],
  exports: [GoalLibraryService],
})
export class GoalLibraryModule {}
