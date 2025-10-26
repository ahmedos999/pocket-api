import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto:CreateUserDto){
    return this.usersService.create(dto)
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(){
    return this.usersService.findAll()
  }
  @Get('count')
  async count(){
    return this.usersService.count()
  }
  @Get(':id')
  async findOne(@Param('id') id:string){
    return this.usersService.findOne(id);
  }
  @Patch(':id')
  async update(@Param('id') id:string,@Body() dto:UpdateUserDto){
    return this.usersService.update(id,dto)
  }
  @Delete(':id')
  async remove(@Param('id') id:string){
    return this.usersService.remove(id)
  }
}
