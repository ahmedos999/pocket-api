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
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers:[
        {
          ttl:60_000,
          limit:120
        }
      ]
    }),
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
    UsersModule,
    AuthModule,
    NotesModule
  ],
  controllers: [AppController,HealthController,MathController],
  providers: [AppService,MathService,DbService,RedisService,PrismaService,{
    provide:APP_GUARD,
    useClass:ThrottlerGuard
  }],
  exports:[PrismaService]
})
export class AppModule {}
