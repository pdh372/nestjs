import { Module, DynamicModule } from '@nestjs/common';
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { socketColor } from '@helper/chalk.helper';
import { IGatewayModuleOption } from '@module/gateway/gateway.interface';
import { UseFilters } from '@nestjs/common';
import { AllWsExceptionsFilter } from '@src/custom/exception/global.exception';

@UseFilters(AllWsExceptionsFilter)
@WebSocketGateway()
export class InitGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    protected server: Server;

    handleConnection(client: Socket) {
        socketColor(`Socket connected id = ${client.id} --- userId = ${client.data.user?._id}`);
    }

    handleDisconnect(client: Socket) {
        socketColor(`Socket disconnected id = ${client.id} --- userId = ${client.data.user?._id}`);
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
