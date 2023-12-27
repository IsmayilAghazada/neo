import { httpClient } from 'app/deps';
import { ICompany } from 'app/models/Company';
import { IPaginatedData } from 'model';
import * as queryString from 'query-string';

export const BASE_COMPANY_URL = '/company';

export const CompanyService = {
    getList(params: any): Promise<IPaginatedData<ICompany> & { search: string }> {
        return httpClient.get(`${BASE_COMPANY_URL}/list?${queryString.stringify(params)}`);
    },

    getByUserId(userId: string | number): Promise<ICompany> {
        return httpClient.get(`${BASE_COMPANY_URL}/userId/${userId}`);
    },

    getById(id: string | number): Promise<ICompany> {
        return httpClient.get(`${BASE_COMPANY_URL}/${id}`);
    },

    save(companyId: number, data: ICompany): Promise<ICompany> {
        return httpClient.post(`${BASE_COMPANY_URL}/${companyId}`, data);
    },
};
