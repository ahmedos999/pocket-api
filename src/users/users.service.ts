import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bycrpt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma:PrismaService){}

    async create(data:{email:string;password:string}){
        const hashedpassword = await bycrpt.hash(data.password,10)

        return this.prisma.user.create({data:{
            email:data.email,
            password:hashedpassword
        },
        select:{
            id:true,
            email:true,
            createdAt:true
        }
    })
    }
    async findAll(){
        return this.prisma.user.findMany({select:{
            id:true,
            email:true,
            createdAt:true
        }});
    }

    async count(){
        return this.prisma.user.count();
    }

    async findOne(id:string){
        return this.prisma.user.findUnique({
            where:{id},
            select:{
                id:true,
                email:true,
                createdAt:true
            }
        })
    }
    async update(id:string,data:UpdateUserDto){
        const updatedData = {...data};

        if(data.password){
            updatedData.password = await bycrpt.hash(data.password,10);
        }

       return this.prisma.user.update({
            where:{id},
            data:updatedData,
            select:{
                email:true,
                id:true,
                createdAt:true
            }
        })
    }
    async remove(id:string){
        return this.prisma.user.delete({
            where:{id},
            select:{
                id:true,
                email:true
            }
        })
    }
}
