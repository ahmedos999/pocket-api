import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteQueryDto } from './dto/note-query.dto';

@Injectable()
export class NotesService {
    constructor(private prisma:PrismaService){}

      async findAllForUser(userId: string, query: NoteQueryDto) {
      const { page = 1, limit = 10, search, sort = 'desc' } = query;

      const skip = (page - 1) * limit;

      return this.prisma.note.findMany({
        where: {
          userId,
          ...(search && {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ],
          }),
        },
        orderBy: {
          createdAt: sort,
        },
        skip,
        take: limit,
      });
    }

    async create(userId:string, dto:CreateNoteDto){
        return this.prisma.note.create({
            data:{
                ...dto,
                userId,
            }
        })
    }
  async findAllForAdmin(){
    return this.prisma.note.findMany();
  }
  async findOne(id:string){
    return this.prisma.note.findUnique({where:{id:id}})
  }

  async update(userId: string, id: string, dto: UpdateNoteDto) {
    const note = await this.findOne(id);

    if (!note || note.userId !== userId) {
      throw new ForbiddenException('You cannot edit this note');
    }

    return this.prisma.note.update({
      where: { id },
      data: dto,
    });
  }

  async delete(userId: string, id: string) {
    const note = await this.findOne(id);

    if (!note || note.userId !== userId) {
      throw new ForbiddenException('You cannot delete this note');
    }

    return this.prisma.note.delete({
      where: { id },
    });
  }

}
