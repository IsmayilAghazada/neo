/* eslint-disable import/no-cycle */
import { IUser } from 'app/deps/userService/model';
import { ECurrencyCode, EGender, EJobType, ESalaryType } from 'enums';
import { IBookmark } from '../Bookmark';
import { ICategory } from '../Category';
import { ISkill } from '../Skill';

export interface IJobSeeker {
    id?: number;
    firstName: string;
    lastName: string;
    birthDay: string;
    gender: EGender;
    expectedSalary: number | null;
    salaryType: ESalaryType | null;
    currency: ECurrencyCode | null;
    category: ICategory;
    skills: ISkill[] | null;
    resumeUrl: string | null;
    user: IUser;
    bookmark?: IBookmark;
    percentageOfProfileCompletion: number;
}

export interface IExperience {
    id?: number;
    companyName: string;
    title: string;
    description: string;
    startingDate: string;
    endDate: string;
    jobSeeker: number;
    jobType: EJobType;
    companyUser: IUser;
}

export interface IEducation {
    id?: number;
    certificateDegreeName: string;
    major: string;
    universityName: string;
    startingDate: string;
    completionDate: string;
    jobSeeker: number;
}

export interface IPortfolio {
    id?: number;
    title: string;
    websiteUrl: string;
    description: string;
    jobSeeker: number;
}
