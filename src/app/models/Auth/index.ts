/* eslint-disable camelcase */
import { EGender, ERole } from 'enums';

export interface IRegisterVIASocial {
    email: string;
    role: ERole;
    social: boolean;
    first_name?: string;
    last_name?: string;
    birthday?: string;
    gender: EGender;
}
