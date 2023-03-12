import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { appColor } from '@helper/chalk.helper';
import { IConnectRedisAdapter } from 'src/module/gateway/gateway.interface';

export class RedisIoAdapter extends IoAdapter {
    private adapterConstructor: ReturnType<typeof createAdapter>;

    async connectToRedis({ redis, configService }: IConnectRedisAdapter): Promise<void> {
        const pubClient = redis;
        const subClient = pubClient.duplicate();

        this.adapterConstructor = createAdapter(pubClient, subClient, {
            key: configService.get('app_name'),
        });
    }

    createIOServer(port: number, options?: ServerOptions): any {
        appColor(`🍺 Registered socket redis adapter`, options);
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
