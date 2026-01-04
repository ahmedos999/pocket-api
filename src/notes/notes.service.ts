import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteQueryDto } from './dto/note-query.dto';

@Injectable()
export class NotesService {
    constructor(private prisma:PrismaService){}

      async findAllForUser(userId: string, query: NoteQueryDto) {
      const { page = 1, limit = 10, search, sort = 'desc', includeDeleted = false } = query;

      const skip = (page - 1) * limit;

      const where: any = {
        userId,
        ...(includeDeleted ? {} : { deletedAt: null }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ],
        }),
      };

      const [items, total] = await this.prisma.$transaction([
        this.prisma.note.findMany({
          where,
          orderBy: { createdAt: sort },
          skip,
          take: limit,
        }),
        this.prisma.note.count({ where }),
      ]);

      return {
        data: items,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          includeDeleted,
        },
      };
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

  async softDelete(userId:string,id:string){
    const notes = await this.prisma.note.findUnique({where:{id}})

    if(!notes || notes.userId != userId){
      throw new ForbiddenException('You cannot delete this note');
    }

    return this.prisma.note.update({
      where:{id},
      data:{deletedAt: new Date()}
    })
  }

  async restore(userId: string, id: string) {
  const note = await this.prisma.note.findUnique({ where: { id } });

  if (!note || note.userId !== userId) {
    throw new ForbiddenException('You cannot restore this note');
  }

  return this.prisma.note.update({
    where: { id },
    data: { deletedAt: null },
  });
}

async addAttachment(userId: string, noteId: string, file: Express.Multer.File) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });

    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId) throw new ForbiddenException('Not your note');

    return this.prisma.attachment.create({
      data: {
        noteId,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}`,
      },
    });
  }

}
