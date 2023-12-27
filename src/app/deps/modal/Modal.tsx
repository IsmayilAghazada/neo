import { useDependencies } from 'app/hooks';
import * as React from 'react';
import { IModalProps, MuiModal } from 'ui-kit/Modal';

interface IState {
    isOpen: boolean;
    request?: IModalProps;
}

const initialState: IState = {
    isOpen: false,
};
export const Modal = () => {
    const { modalService, messageBus } = useDependencies();
    const [state, setState] = React.useState<IState>(initialState);
    const onClose = React.useCallback(() => {
        setState(initialState);
        messageBus.publish({
            type: 'MODAL_REQUEST_FULLFILLED',
            payload: state.request,
        });
    }, [state.request]);

    React.useEffect(() => {
        if (!state.isOpen) {
            state?.request?.onClose?.();
            onClose();
        }
    }, [state.isOpen]);

    React.useEffect(() => {
        return modalService.subscribeModal((request: IModalProps) =>
            setState({ request, isOpen: request?.opened ?? true }),
        );
    }, []);

    return (
        <MuiModal
            opened={state.isOpen}
            {...state.request}
            onClose={() => {
                state?.request?.onClose();
                onClose();
            }}
        />
    );
};
