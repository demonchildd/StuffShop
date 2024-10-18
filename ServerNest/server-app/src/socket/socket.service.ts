import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";


@WebSocketGateway(
    {
        cors: {
            origin: "*"
        }
    }
)
export class SocketService implements OnGatewayConnection{

    @SubscribeMessage('server-path')
    handleEvent(@MessageBody() dto: any, @ConnectedSocket() client: any) {
    
        const res = {dto};
        client.server.emit("client-path", res);
    }

    handleConnection(client: any) {
        console.log('CONNECTED')
    }

}