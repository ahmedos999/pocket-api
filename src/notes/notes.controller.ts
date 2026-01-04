import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteQueryDto } from './dto/note-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

function fileName(req, file, cb) {
  const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, unique + extname(file.originalname));
}

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService:NotesService){}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@CurrentUser() user,@Body() dto:CreateNoteDto){
        return this.notesService.create(user.id,dto)
    }
    // Get my notes
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    findMyNotes(@CurrentUser() user,@Query() query:NoteQueryDto) {
        return this.notesService.findAllForUser(user.id,query);
    }

    // Admin: Get ALL notes
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Get()
    findAllForAdmin() {
        return this.notesService.findAllForAdmin();
    }

    // Update my note
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    update(@CurrentUser() user, @Param('id') id: string, @Body() dto: UpdateNoteDto) {
        return this.notesService.update(user.id, id, dto);
    }


    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    remove(@CurrentUser() user, @Param('id') id: string) {
    return this.notesService.softDelete(user.id, id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/restore')
    restore(@CurrentUser() user, @Param('id') id: string) {
    return this.notesService.restore(user.id, id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/attachments')
    @UseInterceptors(
        FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: fileName,
        }),
        }),
    )
    uploadAttachment(
        @CurrentUser() user,
        @Param('id') noteId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.notesService.addAttachment(user.id, noteId, file);
    }
}