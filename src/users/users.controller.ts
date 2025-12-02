import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { OwnerGuard } from 'src/auth/owner.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto:CreateUserDto){
    return this.usersService.create(dto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@CurrentUser()user: any){
    return user;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('admin-stats')
  getAdminData() {
    return "Secret admin data";
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async updateMe(@CurrentUser() user,@Body() dto: UpdateUserDto){
    return this.usersService.update(user.id,dto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  async deleteMe(@CurrentUser() user) {
    return this.usersService.remove(user.id);
  }

  @UseGuards(AuthGuard('jwt'),OwnerGuard)
  @Patch(':id')
  async updateAny(@Param('id') id:string,@Body() dto:UpdateUserDto){
    return this.usersService.update(id,dto)
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
