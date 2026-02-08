import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './entities/user-type.entity';

@Injectable()
export class UserTypesService {
  constructor(
    @InjectRepository(UserType)
    private userTypesRepository: Repository<UserType>,
  ) {}

  async findAll(): Promise<UserType[]> {
    return await this.userTypesRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<UserType> {
    const userType = await this.userTypesRepository.findOne({
      where: { id },
    });

    if (!userType) {
      throw new NotFoundException('Tipo de usuário não encontrado');
    }

    return userType;
  }

  async findByName(name: string): Promise<UserType | null> {
    return await this.userTypesRepository.findOne({
      where: { name },
    });
  }
}
