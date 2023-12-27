import { httpClient } from 'app/deps';
import { IRecruiter } from 'app/models/Recruiter';

export const BASE_RECRUITER_URL = '/recruiter';

export const RecruiterService = {
    getList(): Promise<IRecruiter[]> {
        return httpClient.get(`${BASE_RECRUITER_URL}/list`);
    },

    getByUserId(userId: string | number): Promise<IRecruiter> {
        return httpClient.get(`${BASE_RECRUITER_URL}/userId/${userId}`);
    },

    getById(id: string | number): Promise<IRecruiter> {
        return httpClient.get(`${BASE_RECRUITER_URL}/${id}`);
    },

    edit(recruiterId: number, data: IRecruiter): Promise<IRecruiter> {
        return httpClient.post(`${BASE_RECRUITER_URL}/${recruiterId}`, data);
    },
};
