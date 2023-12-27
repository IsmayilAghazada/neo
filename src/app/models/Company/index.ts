import { IUser } from 'app/deps/userService/model';

export interface ICompany {
    id?: number;
    name: string;
    description: string;
    establishmentDate: string;
    websiteUrl: string | null;
    user?: IUser;
    percentageOfProfileCompletion: number;
}
