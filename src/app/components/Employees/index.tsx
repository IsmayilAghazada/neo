import * as React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import * as queryString from 'query-string';

import './index.scss';
import { Button, createStyles, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { useAsyncData, useDependencies, usePrevious, useSearchParams } from 'app/hooks';
import { IMessage } from 'app/deps/messageBus';
import { SideBar } from 'ui-kit/SideBar';
import { useBtnStyles } from 'ui-kit/Button';
import { useTranslation } from 'react-i18next';
import { Field } from 'ui-kit/Form/Field';
import { Controller, useForm } from 'react-hook-form';
import { CustomSelect } from 'ui-kit/CustomSelect';
import { range } from 'lodash';
import { isError, isLoading, isSuccess } from 'utils';
import { ECurrencyCode, EINDUSTRY, ESalaryType } from 'enums';
import { NoRecordsPanel } from 'ui-kit/NoRecordsPanel';
import { ServerErrorPanel } from 'ui-kit/ServerErrorPanel';
import { IJobSeeker } from 'app/models/JobSeeker';
import { JobSeekerService } from 'app/services/JobSeeker';
import { IPaginatedData } from 'model';
import { EmployeeItem } from './EmployeeItem';
import { Salary } from '../Profile/MyInfo/Salary';
import { EmployeeItemSkeleron } from './EmployeeItemSkeleton';
import { SecondaryFooter } from '../Layout/Footer/SecondaryFooter';
import { Keyword } from '../Jobs/SideBar/Keyword';

const useStyles = makeStyles(() =>
    createStyles({
        content: {
            position: 'relative',
            flexGrow: 1,
            float: 'right',
            width: 'calc(100% - 360px)',
        },
        noRecords: {
            width: '100%',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
        },
    }),
);

const Employees: React.FC = () => {
    const { t } = useTranslation('Common');
    const classes = useStyles();
    const btnClasses = useBtnStyles();
    const { messageBus } = useDependencies();
    const theme = useTheme();
    const isDownXS = useMediaQuery(theme.breakpoints.down('xs'));
    const [open, setOpen] = React.useState(true);
    const prevOpen = usePrevious(open);
    const [queryParams, setQueryParams] = useSearchParams();
    const [employeesList, setEmployeesList] = useAsyncData<IPaginatedData<Partial<IJobSeeker>>>();
    const { control, handleSubmit, reset } = useForm<
        Partial<IJobSeeker> & {
            minEstimatedBudget: number;
            maxEstimatedBudget: number;
            salary: number[];
            keyword: string[];
        }
    >({
        defaultValues: {
            id: null,
            expectedSalary: null,
            birthDay: null,
            firstName: null,
            lastName: null,
            skills: [],
            gender: null,
            user: null,
            resumeUrl: null,
            // for filter
            minEstimatedBudget: 0,
            maxEstimatedBudget: 150000,
            salary: [0, 150000],
            keyword: [],
        },
    });
    const resetForm = () => {
        const { currency, category, minEstimatedBudget, maxEstimatedBudget, salaryType, keyword } = queryParams as any;
        const salary = [minEstimatedBudget || 0, maxEstimatedBudget || 150000];
        const mappedKeyword = keyword ? keyword.split(',') : [];

        reset({
            currency,
            category,
            salary,
            salaryType,
            keyword: mappedKeyword,
        });
    };

    React.useEffect(() => {
        if (prevOpen !== undefined && isDownXS) {
            messageBus.publish({ type: 'SIDEBAR_DRAWER', payload: false });
        }
    }, [isDownXS]);

    const handleSubmitForm = handleSubmit((model) => {
        const { keyword, salary, salaryType, currency, category } = model;
        const keywordStr = keyword.join(',');
        const minEstimatedBudget = salary[0];
        const maxEstimatedBudget = salary[salary.length - 1];

        const query = {
            ...(queryParams as Record<string, any>),
            keyword: keywordStr,
            minEstimatedBudget,
            maxEstimatedBudget,
            salaryType,
            category,
            currency,
            skip: 0,
        };
        setQueryParams(query);
        if (isDownXS) {
            messageBus.publish({ type: 'SIDEBAR_DRAWER', payload: false });
        }
    });

    React.useEffect(() => {
        const drawerListener = messageBus.subscribe<IMessage<'SIDEBAR_DRAWER', boolean>>(({ payload }) => {
            setOpen(payload);
        }, 'SIDEBAR_DRAWER');
        resetForm();
        return drawerListener;
    }, []);

    React.useEffect(resetForm, [open]);

    React.useEffect(() => {
        setEmployeesList(() => JobSeekerService.getListAll(queryParams));
    }, [queryString.stringify(queryParams as Record<string, any>)]);

    return (
        <div className={`full-page-container ${!open && 'fullWidth'}`}>
            <SideBar
                stickyFooter={
                    <Button
                        fullWidth
                        className={btnClasses.root}
                        variant="contained"
                        color="secondary"
                        component="span"
                        onClick={handleSubmitForm}
                    >
                        {t('Action.SEARCH')}
                    </Button>
                }
            >
                <div className="submit-field">
                    <Controller
                        name="keyword"
                        control={control}
                        render={({ value, onChange }) => (
                            <Keyword
                                placeholder={t('Common:Keyword.placeholderJobSeeker')}
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </div>

                <div className="submit-field">
                    <Controller
                        name="category"
                        control={control}
                        defaultValue={null}
                        render={({ value, onChange }) => (
                            <Field
                                label={t('Common:INDUSTRIES.label')}
                                component={
                                    <CustomSelect
                                        value={value}
                                        onChange={(_, newVal) => {
                                            onChange(newVal);
                                        }}
                                        placeholder={t('Common:INDUSTRIES.label')}
                                        options={Object.keys(EINDUSTRY)}
                                        getOptionLabel={(e) => t(`INDUSTRIES.${e}`)}
                                        renderOption={(e) => t(`INDUSTRIES.${e}`)}
                                    />
                                }
                            />
                        )}
                    />
                </div>

                <div className="submit-field">
                    <Controller
                        name="salaryType"
                        defaultValue={null}
                        control={control}
                        render={({ value, onChange }) => (
                            <Field
                                label={t('Common:SalaryType.label')}
                                component={
                                    <CustomSelect
                                        value={value}
                                        onChange={(_, newVal) => {
                                            onChange(newVal);
                                        }}
                                        placeholder={t('Common:SalaryType.label')}
                                        options={Object.keys(ESalaryType)}
                                        getOptionLabel={(e) => t(`SalaryType.${e}`)}
                                        renderOption={(e) => t(`SalaryType.${e}`)}
                                    />
                                }
                            />
                        )}
                    />
                </div>

                <div className="submit-field">
                    <Controller
                        name="currency"
                        defaultValue={null}
                        control={control}
                        render={({ value, onChange }) => (
                            <Field
                                label={t(`Common:Currency.label`)}
                                component={
                                    <CustomSelect
                                        value={value}
                                        onChange={(_, newVal) => {
                                            onChange(newVal);
                                        }}
                                        placeholder={t(`Common:Currency.placeholder`)}
                                        options={Object.keys(ECurrencyCode)}
                                        getOptionLabel={(option) => option}
                                        renderOption={(option) => option}
                                    />
                                }
                            />
                        )}
                    />
                </div>
                <div className="submit-field">
                    <Controller
                        name="salary"
                        control={control}
                        render={({ value, onChange }) => (
                            <Salary step={50} min={0} max={150000} value={value} onChange={onChange} />
                        )}
                    />
                </div>
            </SideBar>
            <main
                className={classes.content}
                style={{ width: open ? 'calc(100% - 360px)' : '100%', display: isDownXS && open ? 'none' : 'block' }}
            >
                <div className="full-page-content-container">
                    <div className="simplebar-content">
                        <div className="full-page-content-inner">
                            <div className="listings-container grid-layout ">
                                {isError(employeesList) && (
                                    <div className={classes.noRecords}>
                                        <ServerErrorPanel />
                                    </div>
                                )}
                                {isLoading(employeesList) &&
                                    range(1, 15).map((x, i) => <EmployeeItemSkeleron key={i} />)}
                                {isSuccess(employeesList) &&
                                    Boolean(employeesList.data?.list.length) &&
                                    employeesList.data?.list?.map((x, i) => <EmployeeItem data={x} key={i} />)}
                                {isSuccess(employeesList) && !employeesList.data?.list.length && <NoRecordsPanel />}
                            </div>
                        </div>

                        {isSuccess(employeesList) && employeesList.data?.pagination?.count > 1 && (
                            <div className="pagination">
                                <Pagination
                                    page={Number(employeesList.data?.pagination.skip) + 1 || 1}
                                    onChange={(_, value) => {
                                        setQueryParams({ ...(queryParams as any), skip: Number(value - 1) });
                                    }}
                                    count={employeesList.data?.pagination.count}
                                    size="large"
                                    color="secondary"
                                />
                            </div>
                        )}
                        <SecondaryFooter />
                    </div>
                </div>
            </main>
        </div>
    );
};
export default Employees;
