import { EProcessStatus } from 'enums';
import { IAsyncData, IAsyncPaginatedData } from 'model';

export const initialAsyncData: IAsyncData<any> = {
    data: null,
    error: null,
    status: EProcessStatus.IDLE,
};

/**
 * Async data with pagination, initial state.
 */
export const initialAsyncPaginatedData: IAsyncPaginatedData<any> = {
    data: {
        list: null,
        pagination: null,
    },
    error: null,
    status: EProcessStatus.IDLE,
};
export const BACKEND_BASE_URL = '/static';

export const CONTACT_NUMBER = '+994(50) 260 54 88';
