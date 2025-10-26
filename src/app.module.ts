import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { HealthController } from './health.controller';
import { MathController } from './math.controller';
import { MathService } from './math.service';
import { DbService } from './db.service';
import { RedisService } from './redis.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp:{
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
         transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : { target: 'pino-pretty', options: { singleLine: true, translateTime: 'SYS:standard' } },
      }
    }),
    UsersModule
  ],
  controllers: [AppController,HealthController,MathController],
  providers: [AppService,MathService,DbService,RedisService,PrismaService],
  exports:[PrismaService]
})
export class AppModule {}
