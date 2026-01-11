import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports:[
    UsersModule,
    JwtModule.register({
      secret:process.env.JWT_SECRET,
      signOptions:{expiresIn:'1d'},
    })
  ],
  providers: [AuthService,JwtStrategy,PrismaService],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
