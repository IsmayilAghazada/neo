import { httpClient } from 'app/deps';
import { IJobSeeker } from 'app/models/JobSeeker';
import { getFormData } from 'utils/http';
import * as queryString from 'query-string';
import { IPaginatedData } from 'model';

export const BASE_JOBSEEKER_URL = '/jobseeker';

export const JobSeekerService = {
    getListAll(params: any): Promise<IPaginatedData<IJobSeeker>> {
        return httpClient.get(`${BASE_JOBSEEKER_URL}/list?${queryString.stringify(params)}`);
    },

    getByUserId(userId: string | number): Promise<IJobSeeker> {
        return httpClient.get(`${BASE_JOBSEEKER_URL}/userId/${userId}`);
    },

    getById(id: string | number): Promise<IJobSeeker> {
        return httpClient.get(`${BASE_JOBSEEKER_URL}/${id}`);
    },

    getBySkillId(skillId: string | number): Promise<IJobSeeker[]> {
        return httpClient.get(`${BASE_JOBSEEKER_URL}/skill/${skillId}`);
    },

    save(data: IJobSeeker): Promise<void> {
        return httpClient.post(`${BASE_JOBSEEKER_URL}`, data);
    },

    edit(id: string | number, data: IJobSeeker, file?: any): Promise<void> {
        const formData = getFormData(data, file);
        return httpClient.post(`${BASE_JOBSEEKER_URL}/${id}`, formData, httpClient.configPresets.multipartFormData);
    },

    deleteResume(id: string | number): Promise<void> {
        return httpClient.delete(`${BASE_JOBSEEKER_URL}/resume/${id}`);
    },

    downloadResume(url: string): Promise<Blob> {
        return httpClient.get(url, httpClient.configPresets.blobResponse);
    },
};
