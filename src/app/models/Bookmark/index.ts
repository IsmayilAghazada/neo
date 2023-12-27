/* eslint-disable import/no-cycle */
import { IUser } from 'app/deps/userService/model';
import { IJobSeeker } from '../JobSeeker';
import { IPost } from '../Post';

export interface IBookmark {
    id: string;
    type: 'POST' | 'JOBSEEKER';
    createdAt: string;
    post?: IPost;
    jobseeker: IJobSeeker;
    user: IUser;
}
