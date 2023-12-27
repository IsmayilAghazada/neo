/* eslint-disable no-nested-ternary */
import { Avatar, Button, CircularProgress, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import * as queryString from 'query-string';
import { BusinessCenterOutlined, Search } from '@material-ui/icons';
import { useAsyncData, useSearchParams } from 'app/hooks';
import { ICompany } from 'app/models/Company';
import { ROUTES } from 'app/routes/consts';
import { CompanyService } from 'app/services/Company';
import { BACKEND_BASE_URL } from 'consts';
import moment from 'moment';
import { debounce, range } from 'lodash';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { isError, isLoading, isPending, isSuccess } from 'utils';
import { makePath } from 'utils/router';
import './index.scss';
import { Pagination, Skeleton } from '@material-ui/lab';
import { Input } from 'ui-kit/Input';
import { IPaginatedData } from 'model';
import { ServerErrorPanel } from 'ui-kit/ServerErrorPanel';
import { useTranslation } from 'react-i18next';
import { NoRecordsPanel } from 'ui-kit/NoRecordsPanel';
import { useBtnStyles, useCoreBtnStyles } from 'ui-kit/Button';
import { SecondaryFooter } from '../Layout/Footer/SecondaryFooter';

const useStyles = makeStyles((theme) => ({
    largeAvatar: {
        width: theme.spacing(8),
        height: theme.spacing(8),
    },
    text: { display: 'inline-block' },
    noRecords: {
        width: '100%',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
    },
}));

const Companies: React.FC = () => {
    const { t } = useTranslation(['Company', 'Common']);
    const classes = useStyles();
    const btnClasses = useBtnStyles();
    const btnCoreClasses = useCoreBtnStyles();
    const [companyList, setCompanyList] = useAsyncData<IPaginatedData<ICompany> & { search: string }>();
    const [searchVal, setSearchVal] = React.useState('');
    const [queryParams, setQueryParams] = useSearchParams<{ search: string; skip: number }>();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const fetchCompanies = React.useCallback(
        debounce(
            (val: string) => {
                setQueryParams({ search: val, skip: 0 });
            },
            500,
            {
                leading: false,
                trailing: true,
            },
        ),
        [],
    );

    React.useEffect(() => {
        setSearchVal(queryParams.search ?? '');
    }, []);

    React.useEffect(() => {
        if (isSuccess(companyList)) {
            setSearchVal(companyList.data.search);
        }
    }, [companyList]);

    React.useEffect(() => {
        setCompanyList(() => CompanyService.getList(queryParams));
    }, [queryString.stringify(queryParams as Record<string, any>)]);

    return (
        <>
            <div className="simplebar-content">
                <div className="container">
                    <div className="row margin-top-24 margin-left-0 margin-right-0">
                        <Input
                            autoFocus
                            style={{ height: 64 }}
                            value={searchVal}
                            onChange={(e) => {
                                setSearchVal(e.target.value);
                                // fetchCompanies(e.target.value);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    fetchCompanies(searchVal);
                                }
                            }}
                            placeholder={t('name')}
                            fullWidth
                            endAdornment={
                                <Button
                                    type="button"
                                    onClick={() => {
                                        fetchCompanies(searchVal);
                                    }}
                                    className={isDesktop ? btnClasses.root : btnCoreClasses.root}
                                    variant="contained"
                                    color="secondary"
                                >
                                    {isPending(companyList) ? (
                                        <CircularProgress size="1.5rem" color="primary" />
                                    ) : isDesktop ? (
                                        t('Common:Action.SEARCH')
                                    ) : (
                                        <Search color="primary" />
                                    )}
                                </Button>
                            }
                        />
                    </div>
                    {isError(companyList) && (
                        <div className="row margin-top-24 margin-left-0 margin-right-0">
                            <div className={classes.noRecords}>
                                <ServerErrorPanel />
                            </div>
                        </div>
                    )}
                    {isSuccess(companyList) && !companyList.data.list.length && (
                        <div className="row margin-top-24 margin-left-0 margin-right-0">
                            <div className={classes.noRecords}>
                                <NoRecordsPanel />
                            </div>
                        </div>
                    )}
                    <div className="companies-list">
                        {isLoading(companyList) &&
                            range(1, 10).map((x) => (
                                <Link key={x} to={ROUTES.COMPANIES.PATH} className="company">
                                    <div className="company-inner-alignment">
                                        <span className="company-logo">
                                            <Avatar className={classes.largeAvatar}>
                                                <BusinessCenterOutlined />
                                            </Avatar>
                                        </span>
                                        <h4>
                                            <Skeleton variant="text" className={classes.text} width={250} height={20} />
                                        </h4>{' '}
                                        <p>
                                            <Skeleton variant="text" className={classes.text} width={50} height={20} />
                                            &mdash;
                                            <Skeleton variant="text" className={classes.text} width={50} height={20} />
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        {isSuccess(companyList) &&
                            Boolean(companyList.data.list) &&
                            companyList.data.list.map((x) => (
                                <Link
                                    key={x.id}
                                    to={makePath(ROUTES.PROFILE.VIEW_OTHER.PATH, { id: x.user.id })}
                                    className="company"
                                >
                                    <div className="company-inner-alignment">
                                        <span className="company-logo">
                                            {x.user?.imageUrl ? (
                                                <Avatar
                                                    className={classes.largeAvatar}
                                                    src={`${BACKEND_BASE_URL}/${x.user.imageUrl}`}
                                                />
                                            ) : (
                                                <Avatar className={classes.largeAvatar}>
                                                    <BusinessCenterOutlined />
                                                </Avatar>
                                            )}
                                        </span>
                                        <h4>{x.name ?? <>&mdash;</>}</h4>
                                        {x.establishmentDate && (
                                            <p>
                                                {moment(x.establishmentDate, 'YYYY-MM-DD').format('DD.MM.YYYY')}&mdash;
                                                {moment(new Date()).format('DD.MM.YYYY')}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>

                <SecondaryFooter>
                    {isSuccess(companyList) && companyList.data?.pagination?.count > 1 && (
                        <div className="pagination">
                            <Pagination
                                page={Number(companyList.data?.pagination.skip) + 1 || 1}
                                onChange={(_, value) => {
                                    setQueryParams({ ...queryParams, skip: Number(value - 1) });
                                }}
                                count={companyList.data?.pagination.count}
                                size="large"
                                color="secondary"
                            />
                        </div>
                    )}
                </SecondaryFooter>
            </div>
        </>
    );
};
export default Companies;
