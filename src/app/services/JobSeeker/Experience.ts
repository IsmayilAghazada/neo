import { httpClient } from 'app/deps';
import { IExperience } from 'app/models/JobSeeker';

export const BASE_EXPERIENCE_URL = '/experience';

export const ExperienceService = {
    getList(): Promise<IExperience[]> {
        return httpClient.get(`${BASE_EXPERIENCE_URL}/list`);
    },

    getByJobSeekerId(jobSeekerId: string | number): Promise<IExperience[]> {
        return httpClient.get(`${BASE_EXPERIENCE_URL}/jobSeeker/${jobSeekerId}`);
    },

    getById(id: string | number): Promise<IExperience> {
        return httpClient.get(`${BASE_EXPERIENCE_URL}/${id}`);
    },

    getBySkillId(skillId: string | number): Promise<IExperience[]> {
        return httpClient.get(`${BASE_EXPERIENCE_URL}/skill/${skillId}`);
    },

    save(jobSeekerId: number, data: IExperience): Promise<IExperience> {
        return httpClient.post(`${BASE_EXPERIENCE_URL}/${jobSeekerId}`, data);
    },

    delete(jobseekerId: string | number, id: string | number): Promise<void> {
        return httpClient.delete(`${BASE_EXPERIENCE_URL}/jobSeeker/${jobseekerId}/${id}`);
    },
};
