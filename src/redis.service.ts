import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
    });
  }

  async connect() {
    if (this.client.status === 'end' || this.client.status === 'wait') {
      await this.client.connect();
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async ping(): Promise<boolean> {
    await this.connect();
    const res = await this.client.ping();
    return res === 'PONG';
  }
}
