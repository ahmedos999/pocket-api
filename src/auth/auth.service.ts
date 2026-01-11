import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma.service';



@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UsersService,
        private readonly jwtService:JwtService,
        private readonly prisma:PrismaService
    ){}


    async validateUser(email:string,password:string){
        const user = await this.userService.findOneByEmail(email);

        if (!user) throw new UnauthorizedException('Invalid credentials')

        const isPasswordVaild = await bcrypt.compare(password,user.password)
        if (!isPasswordVaild) throw new UnauthorizedException('Invalid credentialsss')

        return user
    }


    async login(email:string,password:string){
        const user = await this.validateUser(email,password)

        const tokens = await this.getTokens(user.id,user.email)

        await this.updateRefreshToken(user.id,await tokens.refreshToken)

        return {
            assess_token:tokens.accessToken,
            refreshtoken:tokens.refreshToken,
            user:{
                id:user.id,
                role:user.role,
                email:user.email
            }
        }
    }

    private async getTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
        }


    private async updateRefreshToken(userId: string, refreshToken: string) {
        const hashed = await bcrypt.hash(refreshToken, 10);

        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashed },
        });
    }

    async refresh(refreshToken: string) {
        const payload = this.jwtService.verify(refreshToken);

        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user || !user.refreshToken)
            throw new ForbiddenException();

        const match = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!match) throw new ForbiddenException();

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
        }
        
    async logout(userId: string) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });

        return { message: 'Logged out' };
    }
}

