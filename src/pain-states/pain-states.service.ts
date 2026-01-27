import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PainState } from './entities/pain-state.entity';

@Injectable()
export class PainStatesService {
  constructor(
    @InjectRepository(PainState)
    private painStatesRepository: Repository<PainState>,
  ) {}

  async findAll(): Promise<PainState[]> {
    return await this.painStatesRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<PainState> {
    return await this.painStatesRepository.findOne({ where: { id } });
  }
}
