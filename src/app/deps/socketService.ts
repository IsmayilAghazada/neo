import { io, Socket } from 'socket.io-client';
import { IBrowserStorage } from './browserStorage/models';
import { IMessageBus } from './messageBus';

export class SocketIOService {
    private socketServer: Socket;

    public constructor(private messageBus: IMessageBus, private storage: IBrowserStorage) {}

    init() {
        this.socketServer = io({
            path: '/v1/ws',
            reconnectionDelayMax: 5000,
            reconnection: true,
            auth: {
                token: this.storage.token.getValue(),
            },
            transports: ['websocket'],
        });
        this.socketServer.onAny((payload) => {
            this.messageBus.publish({ type: 'NOTIFICATION', payload });
        });
    }

    connect() {
        this.init();
    }

    close() {
        this.socketServer.close();
    }

    setReconnect(value = true) {
        this.socketServer.io.reconnection(value);
    }

    addListener(event: string, listener: () => void) {
        this.socketServer.on(event, listener);
    }

    sendMessage(ev: string, ...args: any[]) {
        this.socketServer.emit(ev, args);
    }
}
