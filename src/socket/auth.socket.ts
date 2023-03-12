import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit } from '@nestjs/websockets';
import { InitGateway } from '@src/module/gateway/gateway.module';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { Socket } from 'socket.io';
import { appColor } from '@helper/chalk.helper';

@WebSocketGateway({ namespace: 'auth', cors: { origin: ['http'] } })
export class AuthGateway extends InitGateway implements OnGatewayInit {
    constructor(private readonly mongodbService: MongodbService) {
        super();
    }

    afterInit(): void {
        appColor(`🍺 Socket is running path = "${this.server.path}"`);
        this.server.use(async (socket, next) => {
            // TODO check authen
            const auth = socket.handshake.auth;
            console.log('Authentication', socket.id, auth);

            const user = { _id: '01', username: 1 };

            socket.data.user = user;
            socket.join(user._id);

            next();
        });
    }

    @SubscribeMessage('new-message')
    handleNextAction(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
        this.server.emit('response-event', `you are sent ${body}???`);

        client.emit('me', client.data);
    }

    // @SubscribeMessage('join-room-notify')
    // joinRoom(@MessageBody() body: any, @ConnectedSocket() client: Socket) {}
}
