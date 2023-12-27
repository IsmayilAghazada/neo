import axios, { AxiosInstance } from 'axios';
import { createBrowserHistory, History } from 'history';
import { i18nInstance } from '../../i18n';
import { MessageBus } from './messageBus';
import { LangService } from './langService';
import { HttpClient } from './httpClient';
import { BrowserStorage } from './browserStorage';
import { IBrowserStorage } from './browserStorage/models';
import { IHttpClient } from './httpClient/models';
import { UserService } from './userService';
import { AnalyticsService, IAnalyticsService } from './analyticsService';
import { ModalService } from './modal/modalService';
import { SocketIOService } from './socketService';

export interface IDependencies {
    messageBus: MessageBus;
    langService: LangService;
    storage: IBrowserStorage;
    httpClient: IHttpClient;
    axiosInstance: AxiosInstance;
    userService: UserService;
    history: History;
    analyticsService: IAnalyticsService;
    modalService: ModalService;
    socketService: SocketIOService;
}

export function buildDependencies(): IDependencies {
    const messageBus = new MessageBus('host');
    const langService = new LangService(messageBus, i18nInstance);
    const storage = new BrowserStorage();
    const axiosInstance = axios.create();
    const httpClient = new HttpClient(storage, axiosInstance, messageBus);
    const userService = new UserService(httpClient, messageBus, storage);
    const history = createBrowserHistory();
    const analyticsService = new AnalyticsService();
    const modalService = new ModalService(messageBus);
    const socketService = new SocketIOService(messageBus, storage);
    return {
        history,
        analyticsService,
        messageBus,
        langService,
        storage,
        httpClient,
        axiosInstance,
        userService,
        modalService,
        socketService,
    };
}
export const dependencies = buildDependencies();

export const {
    messageBus,
    analyticsService,
    langService,
    storage,
    httpClient,
    axiosInstance,
    userService,
    socketService,
} = dependencies;
