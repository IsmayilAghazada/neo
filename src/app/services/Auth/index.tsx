/* eslint-disable camelcase */
import { axiosInstance, httpClient } from 'app/deps';
import { IRegisterVIASocial } from 'app/models/Auth';
import { ERole } from 'enums';
import { getFormData } from 'utils/http';

export const BASE_AUTH_URL = '/auth';
export const GOOGLE_API_KEY = 'AIzaSyBwRp1e12ec1vOTtGiA4fcCt2sCUS78UYc';

export const AuthService = {
    downloadPhoto(url: string) {
        return axiosInstance.get(url, { responseType: 'blob' });
    },
    login(email: string, password: string = null, social = false): Promise<string> {
        const data = password ? { email, password, social } : { email, social };
        return httpClient.post(`${BASE_AUTH_URL}/login`, data);
    },
    register(companyName: string, firstName: string, lastName: string, email: string, password: string, role: ERole) {
        return httpClient.post(`${BASE_AUTH_URL}/register`, {
            companyName,
            firstName,
            lastName,
            email,
            password,
            role,
        });
    },
    registerViaSocial(
        { email, role, social, first_name, last_name, birthday, gender }: IRegisterVIASocial,
        file?: any,
    ) {
        return httpClient.post(
            `${BASE_AUTH_URL}/register-social`,
            getFormData(
                {
                    email,
                    role,
                    social,
                    first_name,
                    last_name,
                    birthday,
                    gender,
                },
                file,
            ),
            httpClient.configPresets.multipartFormData,
        );
    },

    chagePassword(oldPassword: string, newPassword: string): Promise<void> {
        return httpClient.post(`${BASE_AUTH_URL}/change-password`, { oldPassword, newPassword });
    },

    changePasswordByLink(newPassword: string, token: string) {
        return httpClient.post(`${BASE_AUTH_URL}/change-password-by-link`, { token, newPassword });
    },

    attempForgotPassword(email: string) {
        return httpClient.post<{ email: string }, void>(`${BASE_AUTH_URL}/attemp-forgot-password`, { email });
    },

    confirmAccountByLink(token: string) {
        return httpClient.post(`${BASE_AUTH_URL}/confirm-account`, { token });
    },
};

export const PeopleService = {
    getPrivateInfo() {
        return httpClient.get(
            `https://content-people.googleapis.com/v1/people/me?personFields=genders,birthdays,emailAddresses&sources=READ_SOURCE_TYPE_PROFILE&key=${GOOGLE_API_KEY}`,
        );
    },
};
