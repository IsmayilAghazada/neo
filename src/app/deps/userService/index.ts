import { initialAsyncData } from 'consts';
import { EProcessStatus } from 'enums';
import { IAsyncData } from 'model';
import { getFormData } from 'utils/http';
import { IBrowserStorage } from '../browserStorage/models';
import { IHttpClient } from '../httpClient/models';
import { IMessageBus } from '../messageBus';
import { IUser } from './model';

export class UserService {
    private readonly baseUrl = '/user';

    private cachedData: any = { ...initialAsyncData };

    constructor(
        private readonly httpClient: IHttpClient,
        private readonly messageBus: IMessageBus,
        private readonly storage: IBrowserStorage,
    ) {}

    public async reqUserData(): Promise<IUser> {
        try {
            this.cachedData = { ...this.cachedData, status: EProcessStatus.PENDING };
            this.storage.userInfo.setValue(this.cachedData);
            const data = await this.httpClient.get<IUser>(
                `${this.baseUrl}`,
                this.httpClient.configPresets.increasedTimeout,
            );

            this.cachedData = { error: null, data, status: EProcessStatus.SUCCESS };
            this.messageBus.publish({ type: 'GET_USER_SUCCESS', payload: { ...this.cachedData } });
            this.storage.userInfo.setValue(this.cachedData);
            return data;
        } catch (error) {
            this.cachedData = { data: null, error, status: EProcessStatus.ERROR };
            this.storage.userInfo.setValue(this.cachedData);
            throw error;
        }
    }

    public getCachedUserData(): IAsyncData<IUser> {
        return { ...this.cachedData };
    }

    public async getUserList(): Promise<IUser[]> {
        return this.httpClient.get<IUser[]>(`${this.baseUrl}`, this.httpClient.configPresets.increasedTimeout);
    }

    public async getUserById(id: string | number): Promise<IUser> {
        return this.httpClient.get<IUser>(`${this.baseUrl}/${id}`, this.httpClient.configPresets.increasedTimeout);
    }

    public async editUser(
        id: string | number,
        data: { email: string; contactNumber: string },
        file: any,
    ): Promise<IUser> {
        return this.httpClient.post<FormData, IUser>(
            `${this.baseUrl}/${id}`,
            getFormData(data, file),
            this.httpClient.configPresets.multipartFormData,
        );
    }

    public async deleteUser(id: string | number): Promise<IUser> {
        return this.httpClient.delete<IUser>(
            `${this.baseUrl}/delete/${id}`,
            this.httpClient.configPresets.increasedTimeout,
        );
    }

    public async disableUser(id: string | number): Promise<IUser> {
        return this.httpClient.delete<IUser>(`${this.baseUrl}/${id}`, this.httpClient.configPresets.increasedTimeout);
    }

    public async uploadUserPhoto(file: any): Promise<IUser> {
        return this.httpClient.post(
            `${this.baseUrl}/photo`,
            getFormData(false, file),
            this.httpClient.configPresets.multipartFormData,
        );
    }
}
