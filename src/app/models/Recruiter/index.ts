import { EGender } from 'enums';

export interface IRecruiter {
    id?: number;
    firstName: string;
    lastName: string;
    birthDay: string;
    gender: EGender;
    percentageOfProfileCompletion: number;
}
