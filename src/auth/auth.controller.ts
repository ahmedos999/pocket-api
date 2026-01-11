import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './current-user.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService:AuthService){}


    @Post('login')
    @Throttle({default:{ttl:60_000,limit:5}})
    async login (@Body() dto:LoginDto){
        return this.authService.login(dto.email,dto.password)
    }

    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string) {
        return this.authService.refresh(refreshToken);
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    logout(@CurrentUser() user) {
    return this.authService.logout(user.id);
    }
}
