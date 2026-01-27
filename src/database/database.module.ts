import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Category } from '../categories/entities/category.entity';
import { PainState } from '../pain-states/entities/pain-state.entity';
import { Product } from '../products/entities/product.entity';
import { Exercise } from '../exercises/entities/exercise.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3308),
        username: configService.get('DB_USERNAME', 'app_user'),
        password: configService.get('DB_PASSWORD', 'app_password'),
        database: configService.get('DB_DATABASE', 'daily_healthy_goals'),
        entities: [Category, PainState, Product, Exercise],
        synchronize: false, // Desabilitar sincronização para seed manual
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
