import { IUser } from 'app/deps/userService/model';

export interface INotification {
    id?: number;
    meta: any;
    status: 'READ' | 'UNREAD';
    type: string;
    user: IUser;
}
