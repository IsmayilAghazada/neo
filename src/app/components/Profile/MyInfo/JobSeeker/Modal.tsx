/* eslint-disable no-nested-ternary */
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    createStyles,
    FormControlLabel,
    makeStyles,
    Radio,
    RadioGroup,
    Slider,
    Typography,
} from '@material-ui/core';
import { DateInput } from 'ui-kit/DatePicker';
import { Input } from 'ui-kit/Input';
import { ECurrencyCode, EGender, EINDUSTRY, ESalaryType } from 'enums';
import * as React from 'react';
import { CustomSelect } from 'ui-kit/CustomSelect/index';
import { Field } from 'ui-kit/Form/Field';
import { Add } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { MuiModal } from 'ui-kit/Modal';
import { IAsyncData, IPaginatedData } from 'model';
import { IJobSeeker } from 'app/models/JobSeeker';
import { Controller, FieldError, useForm } from 'react-hook-form';
import { useAsyncData, useDependencies, useLang } from 'app/hooks';
import { isLoading, isPending, isError, isSuccess } from 'utils';
import { SkillService } from 'app/services/Skill';
import { range } from 'lodash';
import { Alert, Skeleton } from '@material-ui/lab';
import { JobSeekerService } from 'app/services/JobSeeker';
import { useBtnStyles } from 'ui-kit/Button';
import moment from 'moment';
import { validateMandatory } from 'utils/validateAuth';
import { ValidationError } from 'ui-kit/ValidationError';
import { ISkill } from 'app/models/Skill';
import { DocFileLoader } from '../../DocFileLoader';

const useStyles = makeStyles((theme) =>
    createStyles({
        formControl: { width: '100%' },
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
    }),
);
interface IProps {
    opened: boolean;
    onClose: () => void;
    initialData: IAsyncData<IJobSeeker>;
}
export const JobSeekerInfoModal: React.FC<IProps> = ({ opened, onClose, initialData }) => {
    const { t } = useTranslation(['Profile', 'Common']);
    const classes = useStyles();
    const btnClasses = useBtnStyles();
    const { messageBus } = useDependencies();
    const { currentLang } = useLang();
    const [skillList, setSkillList] = useAsyncData<IPaginatedData<ISkill>>();
    const [jobSeekerInfo, setJobSeekerInfo] = useAsyncData<void>();
    const { control, setValue, reset, watch, handleSubmit, errors } = useForm<
        IJobSeeker & {
            file: string;
        }
    >({
        defaultValues: {
            file: null,
            firstName: null,
            lastName: null,
            birthDay: null,
            gender: EGender.FEMALE,
            expectedSalary: 0,
            salaryType: ESalaryType.MONTHLY,
            currency: ECurrencyCode.AZN,
            skills: [],
            resumeUrl: null,
            category: null,
        },
    });
    const [inputVal, setInputVal] = React.useState('');
    const skills = watch('skills');
    const expectedSalary = watch('expectedSalary');
    const salaryType = watch('salaryType');
    const maxValueofExpectedSalary =
        salaryType === ESalaryType.HOURLY ? 100 : salaryType === ESalaryType.MONTHLY ? 15000 : 200000;

    const handleSubmitForm = handleSubmit((model) => {
        const { file, ...rest } = model;
        const birthDay = model.birthDay ? moment(model?.birthDay, 'DD.MM.YYYY').format('YYYY-MM-DD') : null;
        setJobSeekerInfo(() => JobSeekerService.edit(initialData.data.id, { ...rest, birthDay }, file));
    });

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

    const handleDelete = (id: number, name: string) => {
        const transformedSkills = skills.filter((k) => k.name !== name && (id !== null ? k.id !== id : true));
        setValue('skills', transformedSkills);
    };

    React.useEffect(() => {
        if (isSuccess(jobSeekerInfo)) {
            messageBus.publish({ type: 'MY_INFO_MODAL', payload: false });
        }
    }, [jobSeekerInfo]);

    React.useEffect(() => {
        setSkillList(() => SkillService.getList());
    }, []);

    React.useEffect(() => {
        if (isSuccess(initialData)) {
            reset({
                file: null,
                firstName: initialData.data.firstName ?? null,
                lastName: initialData.data.lastName ?? null,
                birthDay: initialData.data.birthDay
                    ? moment(initialData.data?.birthDay, 'YYYY-MM-DD').format('DD.MM.YYYY')
                    : null,
                gender: initialData.data.gender ?? EGender.FEMALE,
                expectedSalary: initialData.data.expectedSalary ?? null,
                salaryType: initialData.data.salaryType ?? ESalaryType.MONTHLY,
                currency: initialData.data.currency ?? ECurrencyCode.AZN,
                skills: initialData.data?.skills ?? [],
                resumeUrl: null,
                category: initialData.data?.category ?? null,
            });
        }
    }, [initialData]);

    return (
        <MuiModal
            mode="overlay"
            opened={opened}
            onClose={onClose}
            divider
            headerPadding
            header={
                <>
                    <div>
                        <Typography component="div">
                            <Box color="#333" fontSize="1.7rem" fontWeight="fontWeightBold" m={1}>
                                {t('titles.profileInfo')}
                            </Box>
                        </Typography>
                    </div>
                </>
            }
            body={
                <>
                    {isLoading(initialData) ||
                        (isPending(jobSeekerInfo) && (
                            <div className="row">
                                {range(10).map((_, i) => (
                                    <div key={i} className="col-xs-12 col-md-6 col-xl-4">
                                        <div className="submit-field">
                                            <Field
                                                label={<Skeleton width={150} height={30} variant="text" />}
                                                component={<Skeleton width={200} height={40} variant="text" />}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    {!isLoading(initialData) && !isPending(jobSeekerInfo) && (
                        <>
                            {isError(jobSeekerInfo) && (
                                <div className="row">
                                    <div className="col-xs-12 col-md-12 col-xl-12">
                                        <div className="submit-field">
                                            <Alert severity="error">{jobSeekerInfo.error.message}</Alert>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="row">
                                <div className="col-xs-12 col-md-6 col-xl-4">
                                    <div className="submit-field">
                                        <Controller
                                            name="firstName"
                                            control={control}
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('Common:FormInputs.firstName.label')}
                                                    component={
                                                        <Input
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder={t('Common:FormInputs.firstName.label')}
                                                            fullWidth
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.firstName?.message} />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-6  col-xl-4">
                                    <div className="submit-field">
                                        <Controller
                                            name="lastName"
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
                                            control={control}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('Common:FormInputs.lastName.label')}
                                                    component={
                                                        <Input
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder={t('Common:FormInputs.lastName.label')}
                                                            fullWidth
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.lastName?.message} />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-6 col-xl-4">
                                    <div className="submit-field">
                                        <Controller
                                            name="birthDay"
                                            control={control}
                                            rules={{
                                                validate: (value) =>
                                                    validateMandatory(
                                                        value
                                                            ? moment(value, 'YYYY-MM-DD').format('DD.MM.YYYY')
                                                            : value,
                                                        t,
                                                    ),
                                            }}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('ProfileInfo.birthday')}
                                                    component={
                                                        <DateInput
                                                            value={value}
                                                            onChange={onChange}
                                                            locale={currentLang.toLocaleLowerCase()}
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.birthDay?.message} />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-6 col-xl-4">
                                    <div className="submit-field">
                                        <Controller
                                            name="gender"
                                            control={control}
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('Common:GENDER.label')}
                                                    component={
                                                        <RadioGroup
                                                            row
                                                            aria-label="gender"
                                                            value={value}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                onChange((event.target as HTMLInputElement).value);
                                                            }}
                                                        >
                                                            <FormControlLabel
                                                                value={EGender.FEMALE}
                                                                control={<Radio />}
                                                                label={t('Common:GENDER.FEMALE')}
                                                            />
                                                            <FormControlLabel
                                                                value={EGender.MALE}
                                                                control={<Radio />}
                                                                label={t('Common:GENDER.MALE')}
                                                            />
                                                        </RadioGroup>
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.gender?.message} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-6 col-xl-4">
                                    <div className="submit-field">
                                        <Controller
                                            name="salaryType"
                                            control={control}
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
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
                                <div className="col-xs-12 col-md-6 col-xl-4">
                                    <div className="submit-field">
                                        <Controller
                                            name="expectedSalary"
                                            control={control}
                                            rules={{
                                                validate: (value) =>
                                                    validateMandatory(value !== null ? value.toString() : value, t),
                                            }}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('ProfileInfo.expectedSalary')}
                                                    component={
                                                        <>
                                                            <Input
                                                                type="number"
                                                                onKeyDown={(event) => {
                                                                    if (
                                                                        ['e', 'E', '-', '+', 'ArrowDown'].includes(
                                                                            event.key,
                                                                        )
                                                                    ) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                                value={expectedSalary === 0 ? '' : expectedSalary}
                                                                onChange={(e) => {
                                                                    onChange(Number(e.target.value));
                                                                }}
                                                                fullWidth
                                                            />
                                                            <Slider
                                                                style={{ paddingTop: 0 }}
                                                                getAriaValueText={() => `${expectedSalary}`}
                                                                value={Number(value)}
                                                                onChange={(_: any, newValue: number) => {
                                                                    onChange(newValue as number);
                                                                }}
                                                                max={maxValueofExpectedSalary}
                                                                min={0}
                                                                valueLabelDisplay="off"
                                                            />
                                                        </>
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.expectedSalary?.message} />
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
                                        <div className="submit-field">
                                            <Controller name="resumeUrl" control={control} render={() => null} />
                                            <Controller
                                                name="file"
                                                control={control}
                                                render={({ value, onChange }) => (
                                                    <Field
                                                        label={t('ProfileInfo.resume')}
                                                        component={<DocFileLoader value={value} onChange={onChange} />}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-6 col-xl-4">
                                    <div className="submit-field">
                                        <Controller
                                            name="skills"
                                            control={control}
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
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
                                                            onChange={(_, newVal) => handleAdd(_, newVal, onChange)}
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
                                                                    onClick={(_: any) => handleAdd(_, null, onChange)}
                                                                >
                                                                    <Add />
                                                                </Button>
                                                            }
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={((errors?.skills as unknown) as FieldError)?.message} />

                                        <div className={classes.chipWrapper}>
                                            {skills?.map(({ id, name }, i: number) => (
                                                <Chip
                                                    key={i}
                                                    label={name}
                                                    onDelete={() => handleDelete(id, name)}
                                                    color="secondary"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            }
            footer={
                <div>
                    <Button
                        onClick={(isLoading(initialData) || !isPending(jobSeekerInfo)) && handleSubmitForm}
                        className={btnClasses.root}
                        variant="contained"
                        color="secondary"
                    >
                        {isLoading(initialData) || isPending(jobSeekerInfo) ? (
                            <CircularProgress size="1.5rem" color="primary" />
                        ) : (
                            t('Common:Action.SAVE')
                        )}
                    </Button>
                </div>
            }
        />
    );
};
JobSeekerInfoModal.displayName = 'JobSeekerInfoModal';
