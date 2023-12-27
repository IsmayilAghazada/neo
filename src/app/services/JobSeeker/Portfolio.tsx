import { httpClient } from 'app/deps';
import { IPortfolio } from 'app/models/JobSeeker';

export const BASE_PORTFOLIO_URL = '/portfolio';

export const PortfolioService = {
    getList(): Promise<IPortfolio[]> {
        return httpClient.get(`${BASE_PORTFOLIO_URL}/list`);
    },

    getByJobSeekerId(jobSeekerId: string | number): Promise<IPortfolio[]> {
        return httpClient.get(`${BASE_PORTFOLIO_URL}/jobSeeker/${jobSeekerId}`);
    },

    getById(id: string | number): Promise<IPortfolio> {
        return httpClient.get(`${BASE_PORTFOLIO_URL}/${id}`);
    },

    save(jobSeekerId: number, data: IPortfolio): Promise<IPortfolio> {
        return httpClient.post(`${BASE_PORTFOLIO_URL}/${jobSeekerId}`, data);
    },

    delete(jobseekerId: string | number, id: string | number): Promise<void> {
        return httpClient.delete(`${BASE_PORTFOLIO_URL}/jobSeeker/${jobseekerId}/${id}`);
    },
};
