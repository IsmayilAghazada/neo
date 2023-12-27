import { ERole, EUserStatus } from 'enums';

export interface IUser {
    id: number;
    role: ERole;
    email: string;
    status: EUserStatus;
    createdAt: string;
    updatedAt: string;
    lastLoginDate: string;
    contactNumber: string;
    imageUrl: string | null;
}
