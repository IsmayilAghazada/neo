import * as Cookies from 'js-cookie';

import { IStorage } from './models';

class CookieStorage implements IStorage {
    public getItem(key: string): string | null {
        return Cookies.get(key) || null;
    }

    public setItem(key: string, value: string): void {
        Cookies.set(key, value);
    }

    public removeItem(key: string): void {
        Cookies.remove(key);
    }
}

export const cookieStorage = new CookieStorage();
