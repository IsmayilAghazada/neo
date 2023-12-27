export interface IMessage<Type extends string = string, Payload = any> {
    payload?: Payload;
    type: Type;
    origin?: string;
}

export interface IMessageBus {
    publish<T extends IMessage<any, any>>(message: T): void;
    subscribe<T extends IMessage<any, any>>(listener: (message: T) => void, type?: T['type']): () => void;
}

export class MessageBus implements IMessageBus {
    private static readonly MESSAGE_TYPE: string = 'NEO_CUSTOM_MESSAGE';

    // eslint-disable-next-line no-useless-constructor
    public constructor(private readonly origin: string) {}

    public publish(message: IMessage<any, any>): void {
        window.dispatchEvent(
            new CustomEvent(MessageBus.MESSAGE_TYPE, {
                detail: {
                    ...message,
                    origin: this.origin,
                },
            }),
        );
    }

    // eslint-disable-next-line class-methods-use-this
    public subscribe<T extends IMessage<any, any>>(listener: (message: T) => void, type?: T['type']): () => void {
        const nativeListener = (({ type: nativeType, detail: message }: CustomEvent<T>) => {
            if (nativeType === MessageBus.MESSAGE_TYPE) {
                if (type == null || message.type === type) {
                    listener(message);
                }
            }
        }) as EventListener;

        window.addEventListener(MessageBus.MESSAGE_TYPE, nativeListener);
        const unsubscribeCallback = () => window.removeEventListener(MessageBus.MESSAGE_TYPE, nativeListener);

        return unsubscribeCallback;
    }
}
