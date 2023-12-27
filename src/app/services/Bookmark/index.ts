import { httpClient } from 'app/deps';
import { IBookmark } from 'app/models/Bookmark';
import { IJobSeeker } from 'app/models/JobSeeker';
import { IPost } from 'app/models/Post';

interface IBookmarkSaveReq {
    type: 'POST' | 'JOBSEEKER';
    post: IPost;
    jobseeker: IJobSeeker;
}

export const BASE_URL = '/bookmark';
export const BookmarkService = {
    getListAll(): Promise<IBookmark> {
        return httpClient.get(`${BASE_URL}/list`);
    },

    getGroupedList(): Promise<IBookmark[]> {
        return httpClient.get(`${BASE_URL}/`);
    },

    getByUserId(userId: string | number): Promise<IBookmark[]> {
        return httpClient.get(`${BASE_URL}/userId/${userId}`);
    },

    getById(id: string | number): Promise<IBookmark> {
        return httpClient.get(`${BASE_URL}/${id}`);
    },

    delete(id: string | number): Promise<IBookmark> {
        return httpClient.delete(`${BASE_URL}/${id}`);
    },

    save(data: IBookmarkSaveReq): Promise<IBookmark> {
        return httpClient.post<IBookmarkSaveReq, IBookmark>(`${BASE_URL}/`, data);
    },
};
