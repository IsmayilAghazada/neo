/* eslint-disable no-useless-escape */
import { TFunction } from 'i18next';
import { isArray } from 'lodash';
// import { isFree } from 'mails';
// import { freemail } from 'freemail';
// import * as freemail from 'freemail';

export const EMAIL_MATCH_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+((\.([\a-z0-9\-]){2,63}){1,})+$/;
export const URL_MATCH_REGEX = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

export function validateMandatory(value: any, t: TFunction): string {
    if (!value || (!isArray(value) && !value.trim()) || (isArray(value) && !value.length)) {
        return t<string>('Common:Error.validation.empty');
    }
    return null;
}

export function validateCompanyName(firstName: string, t: TFunction): string {
    if (!firstName || !firstName.trim()) {
        return t('Common:Error.validation.empty');
    }

    return null;
}

export function validateFistName(firstName: string, t: TFunction): string {
    if (!firstName || !firstName.trim()) {
        return t('Common:Error.validation.empty');
    }

    return null;
}

export function validateLastName(lastName: string, t: TFunction): string {
    if (!lastName || !lastName.trim()) {
        return t('Common:Error.validation.empty');
    }

    return null;
}

export function validateCorparateEmail(email: string, t: TFunction): string {
    if (!email || !email.trim()) {
        return t('Common:Error.validation.empty');
    }
    if (!EMAIL_MATCH_REGEX.test(email)) {
        return t('Common:Error.validation.format');
    }

    return null;
}

export function validateEmail(email: string, t: TFunction): string {
    if (!email || !email.trim()) {
        return t('Common:Error.validation.empty');
    }
    if (!EMAIL_MATCH_REGEX.test(email)) {
        return t('Common:Error.validation.format');
    }

    return null;
}

export function validateWebSiteUrl(url: string, t: TFunction, nullable = false): string {
    if (!nullable && (!url || !url.trim())) {
        return t('Common:Error.validation.empty');
    }
    if (url?.trim()?.length && !URL_MATCH_REGEX.test(url)) {
        return t('Common:Error.validation.format');
    }
    return null;
}

export function validatePassword(password: string, t: TFunction): string {
    if (!password || !password.trim()) {
        return t('Common:Error.validation.empty');
    }
    if (password.length < 4) {
        return t('Common:Error.validation.min', { count: 4 });
    }

    return null;
}

export function validateRepeatPassword(password: string, repeatPassword: string, t: TFunction): string {
    if (!repeatPassword || !repeatPassword.trim()) {
        return t('Common:Error.validation.empty');
    }
    if (repeatPassword.length < 4) {
        return t('Common:Error.validation.min', { count: 4 });
    }
    if (password !== repeatPassword) {
        return t('Common:Error.validation.repeatPassword');
    }

    return null;
}
