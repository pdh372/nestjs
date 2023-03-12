import { Module, DynamicModule } from '@nestjs/common';
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { socketColor } from '@helper/chalk.helper';
import { IGatewayModuleOption } from '@module/gateway/gateway.interface';

@WebSocketGateway()
export class InitGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    protected server: Server;

    handleConnection(client: Socket) {
        socketColor('Client connected', client.id);
    }

    handleDisconnect(client: Socket) {
        socketColor('Client disconnected', client.id);
    }
}

@Module({})
export class GatewayModule {
    static forRoot(config: IGatewayModuleOption): DynamicModule {
        return {
            imports: [...(config.imports || [])],
            module: GatewayModule,
            providers: [...(config.providers || [])],
        };
    }
}
