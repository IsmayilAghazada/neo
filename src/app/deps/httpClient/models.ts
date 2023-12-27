import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type IRequestConfig = AxiosRequestConfig;

export interface IConfigPresets {
    default: IRequestConfig;
    increasedTimeout: IRequestConfig;
    multipartFormData: IRequestConfig;
    blobResponse: IRequestConfig;
}

export interface IHttpClient {
    requestAPI: <Request, Response>(
        method: RequestMethod,
        url: string,
        data: Request,
        config?: IRequestConfig,
    ) => Promise<AxiosResponse<Response>>;

    get: <Response>(url: string, config?: IRequestConfig) => Promise<Response>;

    post: <Request, Response>(url: string, data?: Request, config?: IRequestConfig) => Promise<Response>;

    put: <Request, Response>(url: string, data?: Request, config?: IRequestConfig) => Promise<Response>;

    delete: <Response>(url: string, config?: IRequestConfig) => Promise<Response>;

    patch: <Request, Response>(url: string, data?: Request, config?: IRequestConfig) => Promise<Response>;

    saveAuthHeaders: (headers: AxiosResponse['headers']) => void;
    clearAuthHeaders: () => void;
    hasAuthHeaders: () => boolean;
    removeAuthHeadersFromRequest: (request: AxiosRequestConfig) => AxiosRequestConfig;

    readonly configPresets: IConfigPresets;
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
