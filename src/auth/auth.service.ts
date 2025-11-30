import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'



@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UsersService,
        private readonly jwtService:JwtService
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

        const payload = {sub:user.id,email:user.email,role:user.role}
        const token = this.jwtService.sign(payload)

        return {
            assess_token:token,
            user:{
                id:user.id,
                role:user.role,
                email:user.email
            }
        }
    }
}

