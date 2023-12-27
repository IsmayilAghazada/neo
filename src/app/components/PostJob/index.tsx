/* eslint-disable no-nested-ternary */
/* eslint-disable no-extra-boolean-cast */
import { Button, Chip, CircularProgress, Container, Grid, InputAdornment, makeStyles } from '@material-ui/core';
import { Add, RoomOutlined } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { useAsyncData } from 'app/hooks';
import { IPost } from 'app/models/Post';
import { SkillService } from 'app/services/Skill';
import { ECurrencyCode, EINDUSTRY, EJobType, ESalaryType } from 'enums';
import * as React from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CustomSelect } from 'ui-kit/CustomSelect';
import { Field } from 'ui-kit/Form/Field';
import { Input } from 'ui-kit/Input';
import { TextArea } from 'ui-kit/Textarea';
import { isError, isLoading, isPending, isSuccess } from 'utils';
import './index.scss';
import { debounce } from 'lodash';
import { LocationService } from 'app/services/Location';
import { ILocation } from 'app/models/Location';
import { IPaginatedData } from 'model';
import { PostService } from 'app/services/Post';
import { Loading } from 'ui-kit/Loading';
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router-dom';
import { ROUTES } from 'app/routes/consts';
import { useBtnStyles } from 'ui-kit/Button';
import { validateMandatory } from 'utils/validateAuth';
import { ValidationError } from 'ui-kit/ValidationError';
import { ISkill } from 'app/models/Skill';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
        margin: 0,
        paddingBottom: 64,
    },
    addButton: {
        height: 36,
        width: 36,
        minWidth: 36,
        marginTop: -3,
    },
    chipWrapper: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        marginBottom: theme.spacing(3),
        marginTop: theme.spacing(1),
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}));

const PostJob: React.FC = () => {
    const classes = useStyles();
    const btnClasses = useBtnStyles();
    const { t } = useTranslation(['Company', 'Common']);
    const { id } = useParams<{ id: string }>();
    const {
        push,
        location: { pathname },
    } = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [inputVal, setInputVal] = React.useState('');
    const [inputLocVal, setInputLocVal] = React.useState('');
    const [skillList, setSkillList] = useAsyncData<IPaginatedData<ISkill>>();
    const [locationList, setLocationList] = useAsyncData<IPaginatedData<ILocation>>();
    const [postJob, setPostJob] = useAsyncData<IPost>();
    const [prefilledJob, setPrefilledJob] = useAsyncData<IPost>();
    const { control, handleSubmit, watch, setValue, reset, errors } = useForm<IPost>({
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
            contactInformation: null,
            notificationEmail: null,
        },
    });
    const skills = watch('skills');

    const handleAdd = (_: any, newVal: any[] = null, onChange: (newVal: any[]) => void) => {
        if (newVal === null || !newVal[newVal?.length - 1]?.name?.length) {
            if (newVal?.length && inputVal?.trim()?.length) {
                onChange(
                    skills?.some((k) => k.name === inputVal) ? [...skills] : [...skills, { id: null, name: inputVal }],
                );
            }
        } else if (newVal?.length) {
            onChange(
                skills?.some(
                    (k) => k.name === newVal[newVal?.length - 1]?.name && k.id === newVal[newVal?.length - 1]?.id,
                )
                    ? [...skills]
                    : [
                          ...skills,
                          {
                              id: newVal[newVal?.length - 1]?.id ?? null,
                              name: newVal[newVal?.length - 1]?.name ?? newVal[newVal?.length - 1],
                          },
                      ],
            );
        }
        setInputVal('');
    };

    const handleDelete = (skillId: number, name: string) => {
        const transformedSkills = skills.filter((k) => k.name !== name && (skillId !== null ? k.id !== skillId : true));
        setValue('skills', transformedSkills);
    };
    const handleSubmitForm = handleSubmit((model) => {
        if (id !== undefined) {
            setPostJob(() => PostService.editPost(id, model));
        } else {
            setPostJob(() => PostService.savePost({ ...model, location: model?.location?.id ?? null }));
        }
    });

    const fetchLocation = React.useMemo(
        () =>
            debounce(
                (input: string) => {
                    setLocationList(() => LocationService.getLocation(input));
                },
                500,
                {
                    leading: false,
                    trailing: true,
                },
            ),
        [],
    );

    const fetchSkill = React.useMemo(
        () =>
            debounce(
                (input?: string) => {
                    setSkillList(() => SkillService.getList(input));
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
        if (inputLocVal?.length) {
            fetchLocation(inputLocVal);
        }
    }, [inputLocVal]);

    React.useEffect(() => {
        reset({
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
            contactInformation: null,
            notificationEmail: null,
        });
    }, [pathname]);

    React.useEffect(() => {
        fetchSkill(inputVal);
    }, [inputVal]);

    React.useEffect(() => {
        if (id !== undefined) {
            setPrefilledJob(() => PostService.getById(id));
        } else {
            fetchLocation(inputLocVal);
        }
    }, []);

    React.useEffect(() => {
        if (isSuccess(postJob)) {
            reset({
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
                contactInformation: null,
            });
            if (id === undefined) {
                enqueueSnackbar(t('Common:Success.default'), {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'center', vertical: 'top' },
                    autoHideDuration: 3000,
                });
            } else {
                push(ROUTES.MANAGE_JOBS.PATH);
            }
        } else if (isError(postJob)) {
            enqueueSnackbar(postJob.error.message, {
                variant: 'error',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        }
    }, [postJob]);

    React.useEffect(() => {
        if (isSuccess(prefilledJob)) {
            reset({ ...prefilledJob.data });
        }
    }, [prefilledJob]);

    return (
        <Loading visible={isPending(postJob) || isPending(prefilledJob)} fullPage={false}>
            <Grid container className={classes.root}>
                <Container>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="dashboard-headline padding-bottom-0">
                                <h3>{id !== undefined ? t('PostAJob.title.update') : t('PostAJob.title.post')}</h3>
                            </div>
                            <div className="dashboard-box">
                                <div className="headline">
                                    <h3>
                                        <i className="icon-material-outline-library-add" /> {t('PostAJob.subTitle')}
                                    </h3>
                                </div>

                                <div className="content with-padding padding-bottom-0">
                                    {isError(postJob) && (
                                        <div className="row">
                                            <div className="col-xs-12 col-md-12 col-xl-12">
                                                <div className="submit-field">
                                                    <Alert severity="error">{postJob.error.message}</Alert>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-xs-12 col-md-6 col-xl-4">
                                            <div className="submit-field">
                                                <Controller name="id" control={control} render={() => null} />
                                                <Controller name="user" control={control} render={() => null} />
                                                <Controller
                                                    name="title"
                                                    control={control}
                                                    rules={{
                                                        validate: (value) => validateMandatory(value, t),
                                                    }}
                                                    render={({ value, onChange }) => (
                                                        <Field
                                                            label={t('PostAJob.fields.title')}
                                                            component={
                                                                <Input
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    placeholder={t('PostAJob.fields.title')}
                                                                    fullWidth
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                                <ValidationError error={errors?.title?.message} />
                                            </div>
                                        </div>

                                        <div className="col-xs-12 col-md-6 col-xl-4">
                                            <div className="submit-field">
                                                <Controller
                                                    name="type"
                                                    rules={{
                                                        validate: (value) => validateMandatory(value, t),
                                                    }}
                                                    control={control}
                                                    render={({ value, onChange }) => (
                                                        <Field
                                                            label={t('Common:JobType.label')}
                                                            component={
                                                                <CustomSelect
                                                                    value={value}
                                                                    onChange={(_, newVal) => {
                                                                        onChange(newVal);
                                                                    }}
                                                                    placeholder={t('Common:JobType.label')}
                                                                    options={Object.keys(EJobType)}
                                                                    getOptionLabel={(option) =>
                                                                        t(`Common:JobType.${option}`)
                                                                    }
                                                                    renderOption={(option) =>
                                                                        t(`Common:JobType.${option}`)
                                                                    }
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                                <ValidationError error={errors?.type?.message} />
                                            </div>
                                        </div>

                                        <div className="col-xs-12 col-md-6 col-xl-4">
                                            <div className="submit-field">
                                                <Controller
                                                    name="category"
                                                    rules={{
                                                        validate: (value) => validateMandatory(value, t),
                                                    }}
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
                                                <ValidationError error={(errors?.category as FieldError)?.message} />
                                            </div>
                                        </div>

                                        <div className="col-xs-12 col-md-6 col-xl-4">
                                            <div className="submit-field">
                                                <Controller
                                                    name="salaryType"
                                                    rules={{
                                                        validate: (value) => validateMandatory(value, t),
                                                    }}
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
                                                                    getOptionLabel={(e) => t(`Common:SalaryType.${e}`)}
                                                                    renderOption={(e) => t(`Common:SalaryType.${e}`)}
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                                <ValidationError error={errors?.salaryType?.message} />
                                            </div>
                                        </div>

                                        <div className="col-xs-3 col-md-3 col-xl-2">
                                            <div className="submit-field">
                                                <Controller
                                                    name="minEstimatedBudget"
                                                    control={control}
                                                    render={({ value, onChange }) => (
                                                        <Field
                                                            label={t('Common:Salary.label')}
                                                            component={
                                                                <Input
                                                                    type="number"
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    placeholder="Min"
                                                                    fullWidth
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-3 col-md-3 col-xl-2">
                                            <div className="submit-field">
                                                <Controller
                                                    name="maxEstimatedBudget"
                                                    control={control}
                                                    render={({ value, onChange }) => (
                                                        <Field
                                                            component={
                                                                <Input
                                                                    type="number"
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    placeholder="Max"
                                                                    fullWidth
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-xs-12 col-md-6 col-xl-4">
                                            <div className="submit-field">
                                                <Controller
                                                    name="currency"
                                                    rules={{
                                                        validate: (value) => validateMandatory(value, t),
                                                    }}
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
                                                <ValidationError error={errors?.currency?.message} />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-6 col-xl-4">
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
                                        </div>

                                        <div className="col-xs-12 col-md-6 col-xl-4">
                                            <div className="submit-field">
                                                <Controller
                                                    name="notificationEmail"
                                                    control={control}
                                                    rules={{
                                                        validate: (value) => validateMandatory(value, t),
                                                    }}
                                                    render={({ value, onChange }) => (
                                                        <Field
                                                            label={t('PostAJob.fields.notificationEmail')}
                                                            component={
                                                                <Input
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    placeholder={t('PostAJob.fields.notificationEmail')}
                                                                    fullWidth
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                                <ValidationError error={errors?.notificationEmail?.message} />
                                            </div>
                                        </div>

                                        <div className="col-xs-12 col-md-6 col-xl-4">
                                            <div className="submit-field">
                                                <Controller
                                                    name="skills"
                                                    rules={{
                                                        validate: (value) => validateMandatory(value, t),
                                                    }}
                                                    control={control}
                                                    render={({ value, onChange }) => (
                                                        <Field
                                                            label={t('Common:Skills.label')}
                                                            component={
                                                                <CustomSelect
                                                                    showCloseBtn={false}
                                                                    freeSolo
                                                                    loading={isLoading(skillList)}
                                                                    multiple
                                                                    value={value}
                                                                    onChange={(_, newVal) =>
                                                                        handleAdd(_, newVal, onChange)
                                                                    }
                                                                    onInputChange={(_, newVal) => {
                                                                        setInputVal(newVal);
                                                                    }}
                                                                    renderTags={() => null}
                                                                    placeholder={t('Common:Skills.placeholder')}
                                                                    options={skillList.data?.list ?? []}
                                                                    getOptionLabel={(option) => option.name}
                                                                    renderOption={(option) => `${option.name}`}
                                                                    endAdornment={
                                                                        <Button
                                                                            className={classes.addButton}
                                                                            variant="contained"
                                                                            color="secondary"
                                                                            component="span"
                                                                            onClick={(_: any) =>
                                                                                handleAdd(_, null, onChange)
                                                                            }
                                                                        >
                                                                            <Add />
                                                                        </Button>
                                                                    }
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                                <ValidationError
                                                    error={((errors?.skills as unknown) as FieldError)?.message}
                                                />

                                                <div className={classes.chipWrapper}>
                                                    {skills?.map((item, i: number) => (
                                                        <Chip
                                                            key={i}
                                                            label={item.name}
                                                            onDelete={() => handleDelete(item.id, item.name)}
                                                            color="secondary"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xs-12 col-md-12 col-xl-12">
                                            <div className="submit-field">
                                                <Controller
                                                    name="description"
                                                    rules={{
                                                        validate: (value) => validateMandatory(value, t),
                                                    }}
                                                    control={control}
                                                    render={({ value, onChange }) => (
                                                        <Field
                                                            label={t('Common:FormInputs.description.label')}
                                                            component={
                                                                <TextArea
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    variant="outlined"
                                                                    placeholder={t(
                                                                        'Common:FormInputs.description.label',
                                                                    )}
                                                                    multiline
                                                                    rows={4}
                                                                    rowsMax={6}
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                                <ValidationError error={errors?.description?.message} />
                                            </div>
                                            <div className="submit-field">
                                                <Controller
                                                    name="contactInformation"
                                                    rules={{
                                                        validate: (value) => validateMandatory(value, t),
                                                    }}
                                                    control={control}
                                                    render={({ value, onChange }) => (
                                                        <Field
                                                            label={t('Common:FormInputs.contactInformation.label')}
                                                            component={
                                                                <TextArea
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    variant="outlined"
                                                                    placeholder={t(
                                                                        'Common:FormInputs.contactInformation.label',
                                                                    )}
                                                                    multiline
                                                                    rows={4}
                                                                    rowsMax={6}
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                                <ValidationError error={errors?.contactInformation?.message} />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-md-6 col-xl-6">
                                            <div className="submit-field">
                                                <Button
                                                    onClick={!isPending(postJob) && handleSubmitForm}
                                                    className={btnClasses.root}
                                                    variant="contained"
                                                    color="secondary"
                                                >
                                                    {isPending(postJob) ? (
                                                        <CircularProgress size="1.5rem" color="primary" />
                                                    ) : id !== undefined ? (
                                                        t('Common:Action.EDIT')
                                                    ) : (
                                                        t('Common:Action.CREATE')
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Grid>
        </Loading>
    );
};
PostJob.displayName = 'PostJob';
export default PostJob;
