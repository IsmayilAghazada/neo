/* eslint-disable import/no-cycle */
import { IUser } from 'app/deps/userService/model';
import { ECurrencyCode, EJobType, EPostStatus, ESalaryType } from 'enums';
import { IBookmark } from '../Bookmark';
import { ICategory } from '../Category';
import { IJobSeeker } from '../JobSeeker';
import { ILocation } from '../Location';
import { ISkill } from '../Skill';

export interface IPost {
    id?: number;
    title: string;
    description: string;
    createdAt: string;
    minEstimatedBudget: number | null;
    maxEstimatedBudget: number | null;
    status: EPostStatus;
    type: EJobType;
    salaryType: ESalaryType | null;
    currency: ECurrencyCode;
    skills: ISkill[];
    category: ICategory;
    location: ILocation;
    user: IUser;
    jobseekers: IJobSeeker[];
    bookmark?: Partial<IBookmark>;
    contactInformation?: string;
    notificationEmail?: string;
}
