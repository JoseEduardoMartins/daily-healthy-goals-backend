import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { DailyCheckinsModule } from './daily-checkins/daily-checkins.module';
import { GoalLibraryModule } from './goal-library/goal-library.module';
import { UserDailyGoalsModule } from './user-daily-goals/user-daily-goals.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'app_user'),
        password: configService.get('DB_PASSWORD', 'app_password'),
        database: configService.get('DB_DATABASE', 'daily_healthy_goals'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CategoriesModule,
    DailyCheckinsModule,
    GoalLibraryModule,
    UserDailyGoalsModule,
    AuthModule,
  ],
})
export class AppModule {}
