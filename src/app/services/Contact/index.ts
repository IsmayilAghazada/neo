import { httpClient } from 'app/deps';
import { IContact } from 'app/models/Contact';

export const BASE_CONTACT_URL = '/contact';

export const ContactService = {
    save(data: IContact): Promise<IContact> {
        return httpClient.post(`${BASE_CONTACT_URL}/`, data);
    },
};
