import { Controller,Get } from "@nestjs/common";
import { timeStamp } from "console";
import { uptime } from "process";
import { DbService } from "./db.service";
import { RedisService } from "./redis.service";
import { PrismaService } from "./prisma.service";

@Controller('health')
export class HealthController{
    constructor(
    private readonly db: DbService,
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}
    @Get()
    getHealth(){
        return{
            status:'ok',
            uptime:process.uptime(),
            timeStamp:new Date().toISOString(),
        }
    }
    @Get('db')
    async dbHealth() {
        const ok = await this.db.ping();
        return { db: ok ? 'up' : 'down' };
    }

    @Get('redis')
    async redisHealth() {
        const ok = await this.redis.ping();
        return { redis: ok ? 'up' : 'down' };
    }
    @Get('db/notes-count')
    async notesCount() {
        const count = await this.prisma.note.count();
        return { notes: count };
    }
}