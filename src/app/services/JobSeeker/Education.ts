import { httpClient } from 'app/deps';
import { IEducation } from 'app/models/JobSeeker';

export const BASE_EDUCATION_URL = '/education';

export const EducationService = {
    getList(): Promise<IEducation[]> {
        return httpClient.get(`${BASE_EDUCATION_URL}/list`);
    },

    getByJobSeekerId(jobSeekerId: string | number): Promise<IEducation[]> {
        return httpClient.get(`${BASE_EDUCATION_URL}/jobSeeker/${jobSeekerId}`);
    },

    getById(id: string | number): Promise<IEducation> {
        return httpClient.get(`${BASE_EDUCATION_URL}/${id}`);
    },

    save(jobSeekerId: number, data: IEducation): Promise<IEducation> {
        return httpClient.post(`${BASE_EDUCATION_URL}/${jobSeekerId}`, data);
    },

    delete(jobseekerId: string | number, id: string | number): Promise<void> {
        return httpClient.delete(`${BASE_EDUCATION_URL}/jobSeeker/${jobseekerId}/${id}`);
    },
};
