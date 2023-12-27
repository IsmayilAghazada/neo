import { httpClient } from 'app/deps';
import { INotification } from 'app/models/Notification';
import { IPaginatedData } from 'model';
import * as queryString from 'query-string';

export const BASE_URL = '/notification';
export const NotificationService = {
    getListAll(params: any): Promise<IPaginatedData<Partial<INotification>>> {
        return httpClient.get(`${BASE_URL}/list?${queryString.stringify(params)}`);
    },

    getByUserId(userId: string | number): Promise<INotification[]> {
        return httpClient.get(`${BASE_URL}/userId/${userId}`);
    },

    getById(id: string | number): Promise<INotification> {
        return httpClient.get(`${BASE_URL}/${id}`);
    },

    setStatusRead(id: string | number): Promise<INotification> {
        return httpClient.patch(`${BASE_URL}/read/${id}`);
    },
};
