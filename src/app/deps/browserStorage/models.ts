import { ICompany } from 'app/models/Company';
import { IJobSeeker } from 'app/models/JobSeeker';
import { IRecruiter } from 'app/models/Recruiter';
import { IAsyncData } from 'model';
import { IUser } from '../userService/model';

export interface IBrowserStorage {
    readonly token: IBrowserStorageItem<string>;
    readonly userInfo: IBrowserStorageItem<IAsyncData<IUser>>;
    readonly customerInfo: IBrowserStorageItem<IJobSeeker | ICompany | IRecruiter>;
}

export interface IBrowserStorageItem<T> {
    setValue(value: T): void;
    getValue(): T | null;
    clearValue(): void;
    hasValue(): boolean;
}

export interface IStorage {
    getItem(key: string): string | null;
    removeItem(key: string): void;
    setItem(key: string, value: string): void;
}
