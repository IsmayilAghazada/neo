import { ECheckErrorLevel, EProcessStatus } from 'enums';

/**
 *  Validation error.
 */
export interface ICheckError {
    /** Error message. */
    message: string;
    /** Error path. */
    path?: string;
    /** Error level. */
    level?: ECheckErrorLevel;
}
/**
 * Interface that defines the common properties for error objects.
 */
export interface IError {
    /** Validation errors. */
    checks?: ICheckError[];
    /** Error code. */
    code?: string;
    /** HTTP error code. */
    httpCode?: number;
    /** Error flag. */
    error?: boolean;
    /** Error message. */
    message?: string;
    /** Error unique ID. */
    uuid?: string;
    /** Http request that caused error. */
    request?: any;
}

export interface IPagination {
    skip?: number;
    /** Set count. */
    count?: number;
    /** Next page data existing flag. */
    hasNextPage?: boolean;
    /** Offset from beginning of the data. */
    offset?: number;
    /** Total amount of items. */
    total?: number;
}
export type Maybe<T> = T | null | undefined;
export interface IAsyncDataBase {
    /** Error. */
    error: Maybe<IError>;
    /** Data loading state. */
    status: EProcessStatus;
    /** Used to resolve response race condition issues. */
    timestamp?: number;
}

export interface IAsyncData<T> extends IAsyncDataBase {
    data: Maybe<T>;
}

export interface IPaginatedData<T> {
    list: Maybe<T[]>;
    pagination: Maybe<IPagination>;
}

export interface IAsyncPaginatedData<T> extends IAsyncDataBase {
    data: IPaginatedData<T>;
}
