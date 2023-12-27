import { IModalProps } from 'ui-kit/Modal';
import { IMessage, IMessageBus } from '../messageBus';

type ModalRequestMessage = IMessage<'MODAL_REQUESTED', IModalProps>;
type ModalRequestFullfilledMessage = IMessage<'MODAL_REQUEST_FULLFILLED', IModalProps>;

export interface IModalService {
    requestModal: (_request: IModalProps) => void;
    subscribeModal: (handler: (request: IModalProps) => void) => () => void;
}

export class ModalService implements IModalService {
    public constructor(private readonly messageBus: IMessageBus) {}

    public requestModal = (_request: IModalProps): void => {
        const request = { ..._request };

        this.messageBus.publish<ModalRequestMessage>({
            type: 'MODAL_REQUESTED',
            payload: request,
        });

        const unsubscribe = this.messageBus.subscribe<ModalRequestFullfilledMessage>(() => {
            unsubscribe();
        }, 'MODAL_REQUEST_FULLFILLED');
    };

    public subscribeModal = (handler: (request: IModalProps) => void): (() => void) => {
        return this.messageBus.subscribe<ModalRequestMessage>((msg) => handler(msg.payload as any), 'MODAL_REQUESTED');
    };
}
