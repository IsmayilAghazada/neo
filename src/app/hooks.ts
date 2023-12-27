/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { IAsyncData } from 'model';
import { initialAsyncData, initialAsyncPaginatedData } from 'consts';
import { useHistory, useLocation } from 'react-router-dom';
import * as queryString from 'query-string';
import { ELanguage, EProcessStatus } from '../enums';
import { DependenciesContext, IDependenciesContext } from './deps/DependenciesProvider';
import { IUser } from './deps/userService/model';
import { userService } from './deps';

export function useDependencies(): IDependenciesContext {
    return React.useContext(DependenciesContext);
}

export function useAsyncData<T>(
    hasPagination?: boolean,
    initialAsyncDataParam?: IAsyncData<T>,
): [IAsyncData<T>, (service: () => Promise<T>) => Promise<T>, () => void] {
    const initialData = initialAsyncDataParam
        ? { ...initialAsyncDataParam }
        : hasPagination
        ? { ...initialAsyncPaginatedData }
        : { ...initialAsyncData };
    const [asyncData, setAsyncData] = React.useState<IAsyncData<T>>(initialData);

    function makeRequest(service: () => Promise<T>): Promise<T> {
        setAsyncData((x) => ({ ...x, status: EProcessStatus.PENDING }));
        return service()
            .then((data) => {
                setAsyncData((x) => ({ ...x, data, status: EProcessStatus.SUCCESS }));
                return data;
            })
            .catch((error) => {
                setAsyncData((x) => ({ ...x, error, status: EProcessStatus.ERROR }));
                throw error;
            });
    }

    function reset(): void {
        setAsyncData({ ...initialAsyncData });
    }

    return [asyncData, makeRequest, reset];
}

export function useUser(): [IAsyncData<IUser>, () => Promise<IUser>] {
    const [userData, reqUserData] = useAsyncData<IUser>(false, userService.getCachedUserData());
    const makeRequest = () => reqUserData(() => userService.reqUserData());
    return [userData, makeRequest];
}

export function useLang() {
    const { langService } = useDependencies();
    const [currentLang, setCurrentLang] = React.useState<ELanguage>(langService.getCurrentLang());

    React.useEffect(() => langService.onLanguageChanged(setCurrentLang), [langService]);

    return {
        currentLang,
        setCurrentLang: langService.changeLanguage,
    };
}
const defaultStartPage = 0;
const defaultStartCount = 10;

export function useSearchParams<T>(defaultParams?: T): [T, (params?: Partial<T>) => void] {
    const history = useHistory();
    const location = useLocation();
    const params = queryString.parse(location.search.trim().replace(/^[?#&]/, ''));

    function setSearchParams(p?: Partial<T>): void {
        history.push({
            ...location,
            search: queryString.stringify({ ...p } as Record<string, any>),
        });
    }

    return [{ ...(defaultParams ?? {}), ...params } as any, setSearchParams];
}

export function usePaginationSearchParams(
    params?: Partial<any>, // IListFilter
): [any, (params?: Partial<any>) => void] {
    const [searchParams, setSearchParams] = useSearchParams<any>({
        count: defaultStartCount,
        page: defaultStartPage,
        status: params?.status,
        pin: params?.pin,
    });
    const count = parseInt(searchParams?.count.toString(), 10) ?? defaultStartCount;
    const page = parseInt(searchParams?.page.toString(), 10) ?? defaultStartPage;
    const status = searchParams?.status;
    const pin = searchParams?.pin;

    return [{ count, page, status, pin }, setSearchParams];
}

export function usePrevious<T>(value: T): T {
    const ref = React.useRef<T>();
    React.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export function useScrollTop(element = window) {
    const [scollTop, setScrollTop] = React.useState(undefined);

    // eslint-disable-next-line consistent-return
    React.useEffect(() => {
        const onScroll = (e: any) => {
            setScrollTop(e.target?.documentElement?.scrollTop);
        };
        element.addEventListener('scroll', onScroll);

        return () => element.removeEventListener('scroll', onScroll);
    }, [element]);

    return scollTop;
}
