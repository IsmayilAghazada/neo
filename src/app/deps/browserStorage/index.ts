import { ICompany } from 'app/models/Company';
import { IJobSeeker } from 'app/models/JobSeeker';
import { IRecruiter } from 'app/models/Recruiter';
import { IAsyncData } from 'model';
import { IUser } from '../userService/model';
import { BrowserStorageItem } from './browserStorageItem';
import { IBrowserStorage } from './models';

export class BrowserStorage implements IBrowserStorage {
    public readonly token: BrowserStorageItem<string> = new BrowserStorageItem('token', localStorage);

    public readonly userInfo: BrowserStorageItem<IAsyncData<IUser>> = new BrowserStorageItem('userInfo', localStorage);

    public readonly customerInfo: BrowserStorageItem<IJobSeeker | ICompany | IRecruiter> = new BrowserStorageItem(
        'customerInfo',
        localStorage,
    );
}
