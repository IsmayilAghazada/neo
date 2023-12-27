import { httpClient } from 'app/deps';
import { ICompany } from 'app/models/Company';
import { IJobSeeker } from 'app/models/JobSeeker';
import { IPost } from 'app/models/Post';
import { IPaginatedData } from 'model';
import * as queryString from 'query-string';

export const BASE_POST_URL = '/post';
export const PostService = {
    getListAll(params: any): Promise<IPaginatedData<Partial<IPost> & { company: Partial<ICompany>[] }>> {
        return httpClient.get(`${BASE_POST_URL}/list?${queryString.stringify(params)}`);
    },

    egtListAllInReview() {
        return httpClient.get(`${BASE_POST_URL}/list`);
    },

    getByUserId(userId: string | number): Promise<IPost[]> {
        return httpClient.get(`${BASE_POST_URL}/userId/${userId}`);
    },

    getById(id: string | number): Promise<IPost> {
        return httpClient.get(`${BASE_POST_URL}/${id}`);
    },

    getBySkillId(skillId: string | number): Promise<IPost> {
        return httpClient.get(`${BASE_POST_URL}/skill/${skillId}`);
    },

    blockPost(id: string | number): Promise<IPost> {
        return httpClient.patch(`${BASE_POST_URL}/block/${id}`);
    },

    activatePost(id: string | number): Promise<IPost> {
        return httpClient.patch(`${BASE_POST_URL}/activate/${id}`);
    },

    deletePost(id: string | number): Promise<string> {
        return httpClient.patch(`${BASE_POST_URL}/delete/${id}`);
    },

    savePost(data: any): Promise<IPost> {
        return httpClient.post(`${BASE_POST_URL}/`, data);
    },

    editPost(id: string | number, data: any): Promise<IPost> {
        return httpClient.post(`${BASE_POST_URL}/${id}`, data);
    },

    applyToPost(postId: string | number, data: { jobseekers: IJobSeeker[] }): Promise<IPost> {
        return httpClient.post<{ jobseekers: IJobSeeker[] }, IPost>(`${BASE_POST_URL}/apply/${postId}`, data);
    },
};
