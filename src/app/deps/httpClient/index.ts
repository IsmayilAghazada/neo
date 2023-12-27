/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { EAuthHeadersKeys } from 'enums';
import { IError } from 'model';
import { isReqError, Event } from 'utils';
import { IBrowserStorage } from '../browserStorage/models';
import { IMessageBus } from '../messageBus';

import { IConfigPresets, IHttpClient, IRequestConfig, RequestMethod } from './models';

export class HttpClient implements IHttpClient {
    public onApiContractViolated: Event<{ config: AxiosRequestConfig; errors: any }> = new Event();

    public onRequestUnauthorized: Event = new Event();

    public onRequestTimeout: Event = new Event();

    private static readonly DEFAULT_CONFIG: IRequestConfig = {
        baseURL: `/v1/`,
        timeout: 30000,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    private static readonly BLOB_RESPONSE: IRequestConfig = {
        ...HttpClient.DEFAULT_CONFIG,
        responseType: 'blob',
        timeout: 0,
    };

    private static readonly INCREASED_TIMEOUT: IRequestConfig = {
        ...HttpClient.DEFAULT_CONFIG,
        timeout: 60000,
    };

    private static readonly MULTIPART_FORM_DATA: IRequestConfig = {
        ...HttpClient.INCREASED_TIMEOUT,
        headers: { 'Content-Type': 'multipart/form-data' },
    };

    public readonly configPresets: IConfigPresets = {
        blobResponse: HttpClient.BLOB_RESPONSE,
        default: HttpClient.DEFAULT_CONFIG,
        increasedTimeout: HttpClient.INCREASED_TIMEOUT,
        multipartFormData: HttpClient.MULTIPART_FORM_DATA,
    };

    public constructor(
        private readonly storage: IBrowserStorage,
        private readonly axiosInstance: AxiosInstance,
        private readonly messageBus: IMessageBus,
    ) {}

    public requestAPI = <Request, Response>(
        method: RequestMethod,
        url: string,
        data: Request,
        config?: IRequestConfig,
    ): Promise<AxiosResponse<Response>> => {
        const requestConfig = this.prepareRequestConfig(method, url, data, config);

        return new Promise<AxiosResponse>((resolve, reject) => {
            this.axiosInstance
                .request(requestConfig)
                .then((response) => {
                    const responseData = HttpClient.unwrapResponse(response.data);
                    resolve({
                        ...response,
                        data: responseData,
                    });
                })
                .catch((error: AxiosError) => {
                    const normalizedError = HttpClient.normalizeError(error);

                    switch (normalizedError.httpCode) {
                        case 401:
                            this.clearAuthHeaders();
                            this.messageBus.publish({ type: 'UNAUTHORIZED' });
                            this.onRequestUnauthorized.__invokeCallbacks();
                            reject(normalizedError);
                            break;
                        case 408:
                            this.onRequestTimeout.__invokeCallbacks();
                            reject(normalizedError);
                            break;
                        case 406:
                            reject(normalizedError);
                            break;
                        default:
                            if (error.message !== 'Network Error') {
                                console.error(
                                    `${normalizedError?.request?.method} to ${normalizedError?.request?.url} failed`,
                                    error,
                                );
                            }
                            reject(normalizedError);
                    }
                });
        });
    };

    public get = <Response>(url: string, config?: IRequestConfig): Promise<Response> => {
        return this.requestAPIData('get', url, {}, config);
    };

    public post = <Request, Response>(url: string, data: Request, config?: IRequestConfig): Promise<Response> => {
        return this.requestAPIData('post', url, data, config);
    };

    public put = <Request, Response>(url: string, data: Request, config?: IRequestConfig): Promise<Response> => {
        return this.requestAPIData('put', url, data, config);
    };

    public delete = <Response>(url: string, config?: IRequestConfig): Promise<Response> => {
        return this.requestAPIData('delete', url, null, config);
    };

    public patch = <Request, Response>(url: string, data?: Request, config?: IRequestConfig): Promise<Response> => {
        return this.requestAPIData('patch', url, data, config);
    };

    private requestAPIData = <TRequestData, TResponseData>(
        method: RequestMethod,
        url: string,
        data: TRequestData,
        config?: IRequestConfig,
    ): Promise<TResponseData> => {
        // If there is an ongoing refresh token request we should wait for it.
        // Otherwise execute prepared request directly.
        return Promise.resolve()
            .then(() => this.requestAPI<TRequestData, TResponseData>(method, url, data, config))
            .then((response) => response.data);
    };

    public saveAuthHeaders = (headers: AxiosResponse['headers']): void => {
        this.storage.token.setValue(headers[EAuthHeadersKeys.TOKEN]);
    };

    public clearAuthHeaders = (): void => {
        this.storage.token.clearValue();
        this.storage.userInfo.clearValue();
        this.storage.customerInfo.clearValue();
    };

    public hasAuthHeaders = (): boolean => {
        return this.storage.token.hasValue();
    };

    public removeAuthHeadersFromRequest = (request: AxiosRequestConfig): AxiosRequestConfig => {
        return {
            ...request,
            headers: {
                ...request.headers,
                [EAuthHeadersKeys.TOKEN]: undefined,
            },
        };
    };

    private prepareRequestConfig = (
        method: RequestMethod,
        url: string,
        data: any,
        config?: IRequestConfig,
    ): IRequestConfig => {
        const authHeaders = {
            [EAuthHeadersKeys.TOKEN]: this.storage.token.getValue(),
        };

        const requestConfig: IRequestConfig = {
            ...HttpClient.DEFAULT_CONFIG,
            ...config,
            data,
            headers: {
                ...(config ? config.headers : {}),
                'db-user-agent': navigator.userAgent,
                ...authHeaders,
            },
            method,
            url,
        };

        return requestConfig;
    };

    public static unwrapResponse = (response: any): any => {
        return response && response.data !== undefined && !response.pagination ? response.data : response;
    };

    private static normalizeError = (axiosError: AxiosError): IError => {
        let result: IError;

        if (axiosError.response) {
            if (isReqError(axiosError.response.data)) {
                // server managed error
                result = axiosError.response.data;
            } else {
                const message =
                    axiosError.response.headers &&
                    axiosError.response.headers['content-type'] &&
                    axiosError.response.headers['content-type'].indexOf('application/json') !== -1 &&
                    axiosError.response.data
                        ? axiosError.response.data.message ||
                          (typeof axiosError.response.data !== 'object' ? axiosError.response.data.toString() : null)
                        : null;

                result = {
                    code:
                        (axiosError.response.data && axiosError.response.data.code) ||
                        axiosError.response.statusText ||
                        'UNKNOWN_ERROR',
                    httpCode: axiosError.response.status || 400,
                    message,
                };
            }
        } else {
            result = {
                code: axiosError.code || 'UNKNOWN_ERROR',
                httpCode: axiosError.code === 'ECONNABORTED' ? 408 : 400,
                message: undefined,
            };
        }

        result.request = axiosError.config;

        return result;
    };
}
