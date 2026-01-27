import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PainState } from './entities/pain-state.entity';
import { PainStatesService } from './pain-states.service';
import { PainStatesController } from './pain-states.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PainState])],
  controllers: [PainStatesController],
  providers: [PainStatesService],
  exports: [PainStatesService],
})
export class PainStatesModule {}
