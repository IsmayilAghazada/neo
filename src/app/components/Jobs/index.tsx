import * as React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import * as queryString from 'query-string';

import './index.scss';
import { Button, createStyles, InputAdornment, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { useAsyncData, useDependencies, usePrevious, useSearchParams } from 'app/hooks';
import { IMessage } from 'app/deps/messageBus';
import { IPost } from 'app/models/Post';
import { PostService } from 'app/services/Post';
import { SideBar } from 'ui-kit/SideBar';
import { useBtnStyles } from 'ui-kit/Button';
import { useTranslation } from 'react-i18next';
import { Field } from 'ui-kit/Form/Field';
import { Controller, useForm } from 'react-hook-form';
import { CustomSelect } from 'ui-kit/CustomSelect';
import { RoomOutlined } from '@material-ui/icons';
import { IPaginatedData } from 'model';
import { ILocation } from 'app/models/Location';
import { debounce, range } from 'lodash';
import { LocationService } from 'app/services/Location';
import { isError, isLoading, isPending, isSuccess } from 'utils';
import { ECurrencyCode, EINDUSTRY, EJobType, ESalaryType } from 'enums';
import { ICompany } from 'app/models/Company';
import { NoRecordsPanel } from 'ui-kit/NoRecordsPanel';
import { ServerErrorPanel } from 'ui-kit/ServerErrorPanel';
import { JobItem } from './JobItem';
import { Salary } from '../Profile/MyInfo/Salary';
import { Keyword } from './SideBar/Keyword';
import { JobType } from './SideBar/JobType';
import { JobItemSkeleron } from './JobItemSkeleton';
import { SecondaryFooter } from '../Layout/Footer/SecondaryFooter';

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
const defaultTypes = Object.keys(EJobType).map((x) => ({ [x]: false }));
const Jobs: React.FC = () => {
    const { t } = useTranslation('Common');
    const classes = useStyles();
    const btnClasses = useBtnStyles();
    const { messageBus } = useDependencies();
    const theme = useTheme();
    const isDownXS = useMediaQuery(theme.breakpoints.down('xs'));
    const [open, setOpen] = React.useState(true);
    const prevOpen = usePrevious(open);
    const [queryParams, setQueryParams] = useSearchParams();
    const [postList, setPostList] = useAsyncData<IPaginatedData<Partial<IPost> & { company: Partial<ICompany>[] }>>();
    const [inputLocVal, setInputLocVal] = React.useState('');
    const [locationList, setLocationList] = useAsyncData<IPaginatedData<ILocation>>();
    const { control, handleSubmit, reset } = useForm<
        Partial<IPost> & {
            salary: number[];
            keyword: string[];
            jobTypes: { [x: string]: boolean }[];
        }
    >({
        defaultValues: {
            id: null,
            title: null,
            description: null,
            createdAt: null,
            minEstimatedBudget: null,
            maxEstimatedBudget: null,
            status: null,
            type: null,
            salaryType: null,
            currency: null,
            skills: [],
            category: null,
            location: null,
            user: null,
            jobseekers: [],
            salary: [0, 150000],
            keyword: [],
            jobTypes: defaultTypes,
        },
    });
    const resetForm = () => {
        const {
            currency,
            minEstimatedBudget,
            maxEstimatedBudget,
            category,
            type,
            keyword,
            location,
            locObj,
            salaryType,
        } = queryParams as any;
        const salary = [minEstimatedBudget || 0, maxEstimatedBudget || 150000];
        const mappedType = type
            ? type.split(',').reduce((acc: { [x: string]: boolean }[], cur: string) => {
                  return acc.map((x) => (Object.keys(x)[0] === cur ? { [cur]: true } : x));
              }, defaultTypes)
            : defaultTypes;
        const mappedKeyword = keyword ? keyword.split(',') : [];
        const mapedLocation = location ? JSON.parse(locObj) : null;
        reset({
            currency,
            salary,
            salaryType,
            category,
            jobTypes: mappedType,
            keyword: mappedKeyword,
            location: mapedLocation,
        });
    };
    const fetchLocation = React.useMemo(
        () =>
            debounce(
                (input: string) => {
                    setLocationList(() => LocationService.getLocation(input));
                },
                300,
                {
                    leading: false,
                    trailing: true,
                },
            ),
        [],
    );

    React.useEffect(() => {
        if (inputLocVal?.length) {
            fetchLocation(inputLocVal);
        }
    }, [inputLocVal]);

    React.useEffect(() => {
        if (prevOpen !== undefined && isDownXS) {
            messageBus.publish({ type: 'SIDEBAR_DRAWER', payload: false });
        }
    }, [isDownXS]);

    const handleSubmitForm = handleSubmit((model) => {
        const { keyword, salary, category, jobTypes, currency, location, salaryType } = model;
        const keywordStr = keyword.join(',');
        const minEstimatedBudget = salary[0];
        const maxEstimatedBudget = salary[salary.length - 1];
        const typeStr = jobTypes
            .map((x) => (Object.values(x)[0] ? Object.keys(x)[0] : null))
            .filter(Boolean)
            .join(',');
        const locationStr = location?.id;
        const locObj = location?.id
            ? JSON.stringify({ id: location.id, city: location.city, country: location.country })
            : null;

        const query = {
            ...(queryParams as Record<string, any>),
            salaryType,
            keyword: keywordStr,
            minEstimatedBudget,
            maxEstimatedBudget,
            category,
            type: typeStr,
            currency,
            location: locationStr,
            locObj,
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
        setPostList(() => PostService.getListAll(queryParams));
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
                        {t('Common:Action.SEARCH')}
                    </Button>
                }
            >
                <div className="submit-field">
                    <Controller
                        name="location"
                        control={control}
                        render={({ value, onChange }) => (
                            <Field
                                label={t('Common:location')}
                                component={
                                    <CustomSelect
                                        loading={isPending(locationList)}
                                        value={value}
                                        onChange={(_, newVal) => {
                                            onChange(newVal);
                                        }}
                                        onInputChange={(_, newVal) => {
                                            setInputLocVal(newVal);
                                        }}
                                        renderTags={() => null}
                                        placeholder={t('Common:location')}
                                        options={locationList.data?.list ?? []}
                                        getOptionLabel={(e) => {
                                            return `${e.city} (${e.country})`;
                                        }}
                                        renderOption={(e) => {
                                            return `${e.city} (${e.country})`;
                                        }}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <RoomOutlined />
                                            </InputAdornment>
                                        }
                                    />
                                }
                            />
                        )}
                    />
                </div>

                <div className="submit-field">
                    <Controller
                        name="keyword"
                        control={control}
                        render={({ value, onChange }) => <Keyword value={value} onChange={onChange} />}
                    />
                </div>

                <div className="submit-field">
                    <Controller
                        name="category"
                        control={control}
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
                                        getOptionLabel={(e) => t(`Common:INDUSTRIES.${e}`)}
                                        renderOption={(e) => t(`Common:INDUSTRIES.${e}`)}
                                    />
                                }
                            />
                        )}
                    />
                </div>

                <div className="submit-field">
                    <Controller
                        name="jobTypes"
                        control={control}
                        render={({ value, onChange }) => <JobType value={value} onChange={onChange} />}
                    />
                </div>
                <div className="submit-field">
                    <Controller
                        name="salaryType"
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
                                        getOptionLabel={(option) => t(`Common:SalaryType.${option}`)}
                                        renderOption={(option) => t(`Common:SalaryType.${option}`)}
                                    />
                                }
                            />
                        )}
                    />
                </div>

                <div className="submit-field">
                    <Controller
                        name="currency"
                        control={control}
                        render={({ value, onChange }) => (
                            <Field
                                label={t('Common:Currency.label')}
                                component={
                                    <CustomSelect
                                        value={value}
                                        onChange={(_, newVal) => {
                                            onChange(newVal);
                                        }}
                                        placeholder={t('Common:Currency.placeholder')}
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
                style={{
                    width: open ? 'calc(100% - 360px)' : '100%',
                    display: isDownXS && open ? 'none' : 'block',
                }}
            >
                <div className="full-page-content-container">
                    <div className="simplebar-content">
                        <div className="full-page-content-inner">
                            <div className="listings-container grid-layout ">
                                {isError(postList) && (
                                    <div className={classes.noRecords}>
                                        <ServerErrorPanel />
                                    </div>
                                )}
                                {isLoading(postList) && range(1, 15).map((x, i) => <JobItemSkeleron key={i} />)}
                                {isSuccess(postList) &&
                                    Boolean(postList.data?.list.length) &&
                                    postList.data?.list?.map((x, i) => <JobItem data={x} key={i} />)}
                                {isSuccess(postList) && !postList.data?.list.length && <NoRecordsPanel />}
                            </div>
                        </div>

                        {isSuccess(postList) && postList.data?.pagination?.count > 1 && (
                            <div className="pagination">
                                <Pagination
                                    page={Number(postList.data?.pagination.skip) + 1 || 1}
                                    onChange={(_, value) => {
                                        setQueryParams({ ...(queryParams as any), skip: Number(value - 1) });
                                    }}
                                    count={postList.data?.pagination.count}
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
export default Jobs;
