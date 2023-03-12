import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { InitGateway } from '@src/module/gateway/gateway.module';

@WebSocketGateway({ namespace: 'public', cors: { origin: ['http2'] } })
export class PublicGateway extends InitGateway {
    @SubscribeMessage('new-message')
    handleNextAction(@MessageBody() body: any) {
        this.server.emit('response-event', `you are sent ${body}???`);
    }
}
