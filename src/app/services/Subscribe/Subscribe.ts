import { httpClient } from 'app/deps';
import { IContact } from 'app/models/Contact';

export const BASE_SUBSCRIBE_URL = '/subscribe';

export const SubscribeService = {
    save(data: { email: string }): Promise<IContact> {
        return httpClient.post(`${BASE_SUBSCRIBE_URL}/`, data);
    },
};
