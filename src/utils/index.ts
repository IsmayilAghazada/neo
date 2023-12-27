import { EProcessStatus } from 'enums';
import { IAsyncData, IAsyncPaginatedData, IError } from 'model';

export function isReqError(obj: any): obj is IError {
    return Boolean(obj) && (obj as IError).error === true;
}

export class Event<Arg = undefined> {
    private callbacks: Array<(arg?: Arg) => void> = [];

    public addCallback(...callbacks: Array<(arg: Arg) => void>): void {
        callbacks.forEach((cb) => this.callbacks.push(cb));
    }

    public __invokeCallbacks = (arg?: Arg): void => {
        this.callbacks.forEach((cb) => cb(arg));
    };
}

export const isInitial = (data: IAsyncData<any>) => data.status === EProcessStatus.IDLE;

export const isLoading = (data: IAsyncData<any>) =>
    data.status === EProcessStatus.PENDING || data.status === EProcessStatus.IDLE;

export const isPending = (data: IAsyncData<any>) => data.status === EProcessStatus.PENDING;

export const isSuccess = (data: IAsyncData<any>) => data.status === EProcessStatus.SUCCESS;

export const isError = (data: IAsyncData<any>) => data.status === EProcessStatus.ERROR;

export const isInitialLoading = (data: IAsyncData<any>) => isLoading(data) && data.data === null;

export const isInitialPending = (data: IAsyncData<any>) => isPending(data) && data.data === null;

export const isPaginatedDataInitialPending = (data: IAsyncPaginatedData<any>) =>
    isPending(data) && (data.data.list === null || data.data.list === undefined);
