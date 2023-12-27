import { Input } from 'ui-kit/Input';
import React from 'react';
import { Field } from 'ui-kit/Form/Field';
import { TextArea } from 'ui-kit/Textarea';
import { DateInput } from 'ui-kit/DatePicker';
import { ArrayField, Controller, useForm } from 'react-hook-form';
import { IExperience } from 'app/models/JobSeeker';
import { MuiModal } from 'ui-kit/Modal';
import { Box, Button, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useAsyncData, useLang } from 'app/hooks';
import { ExperienceService } from 'app/services/JobSeeker/Experience';
import { isError, isLoading, isPending, isSuccess } from 'utils';
import { Alert, Skeleton } from '@material-ui/lab';
import { debounce, range } from 'lodash';
import { CustomSelect } from 'ui-kit/CustomSelect';
import { CompanyService } from 'app/services/Company';
import { EJobType } from 'enums';
import { ICompany } from 'app/models/Company';
import { useBtnStyles } from 'ui-kit/Button';
import { IPaginatedData } from 'model';
import moment from 'moment';
import { ValidationError } from 'ui-kit/ValidationError';
import { validateMandatory } from 'utils/validateAuth';
import { ProfileContext } from '../ProfileContext';

interface IProps {
    opened: boolean;
    initialData?: Partial<ArrayField<IExperience, 'fieldId'>>;
    onClose: () => void;
    onSave: (data: IExperience, index?: number) => void;
}

export const ExperienceModal: React.FC<IProps> = ({ opened, onClose, initialData, onSave }) => {
    const { t } = useTranslation(['Profile', 'Common']);
    const { clientData } = React.useContext(ProfileContext);
    const btnClasses = useBtnStyles();
    const [companyList, setCompanyList] = useAsyncData<IPaginatedData<ICompany>>();
    const { control, handleSubmit, setValue, watch, reset, errors } = useForm<IExperience>({
        defaultValues: {
            id: null,
            companyName: null,
            title: null,
            startingDate: null,
            endDate: null,
            description: null,
            companyUser: null,
        },
    });
    const companyName = watch('companyName');
    const { currentLang } = useLang();
    const [experience, setExperience] = useAsyncData<IExperience>();
    const handleSubmitForm = handleSubmit((model) => {
        const startingDate = model.startingDate ? moment(model.startingDate, 'DD.MM.YYYY').format('YYYY-MM-DD') : null;
        const endDate = model.endDate ? moment(model.endDate, 'DD.MM.YYYY').format('YYYY-MM-DD') : null;

        setExperience(() =>
            ExperienceService.save(clientData?.data?.id, {
                ...model,
                startingDate,
                endDate,
                jobSeeker: clientData?.data?.id,
            }),
        );
    });

    const handleAdd = (_: any, newVal: any = null, onChange: (newVal: any) => void) => {
        if (newVal === null) {
            onChange(null);
            setValue('companyUser', null);
        } else if (newVal) {
            onChange(newVal?.name ?? newVal);
            setValue('companyUser', newVal?.user?.id ?? null);
        } else {
            onChange(null);
            setValue('companyUser', null);
        }
    };
    const fetchCompanies = React.useCallback(
        debounce(
            (val: string) => {
                setCompanyList(() => CompanyService.getList({ search: val, skip: 0 }));
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
        fetchCompanies(companyName);
    }, [companyName]);

    React.useEffect(() => {
        if (isSuccess(experience)) {
            onSave(experience.data, initialData?.id || null);
        }
    }, [experience]);

    React.useEffect(() => {
        if (initialData !== null) {
            reset({ ...initialData, companyUser: (initialData?.companyUser?.id as any) ?? null });
        } else {
            reset({
                id: null,
                companyName: null,
                title: null,
                startingDate: null,
                endDate: null,
                description: null,
                companyUser: null,
            });
        }
    }, [initialData]);

    return (
        <MuiModal
            mode="overlay"
            opened={opened}
            onClose={() => onClose()}
            divider
            headerPadding
            header={
                <Typography component="div">
                    <Box color="#333" fontSize="1.7rem" fontWeight="fontWeightBold" m={1}>
                        {t('titles.experience')}
                    </Box>
                </Typography>
            }
            body={
                <>
                    {isPending(experience) && (
                        <div className="row">
                            {range(10).map((_, i) => (
                                <div key={i} className="col-xs-12 col-md-6 col-xl-6">
                                    <div className="submit-field">
                                        <Field
                                            label={<Skeleton width={150} height={30} variant="text" />}
                                            component={<Skeleton width={200} height={40} variant="text" />}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {!isPending(experience) && (
                        <>
                            {isError(experience) && (
                                <div className="row">
                                    <div className="col-xs-12 col-md-12 col-xl-12">
                                        <div className="submit-field">
                                            <Alert severity="error">{experience.error.message}</Alert>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="row">
                                <div className="col-xs-12 col-md-6 col-xl-6">
                                    <div className="submit-field">
                                        <Controller control={control} name="id" render={() => null} />
                                        <Controller control={control} name="companyUser" render={() => null} />
                                        <Controller
                                            name="companyName"
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
                                            control={control}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('Experience.name')}
                                                    component={
                                                        <CustomSelect
                                                            freeSolo
                                                            loading={isLoading(companyList)}
                                                            value={value}
                                                            inputValue={companyName === null ? '' : companyName}
                                                            onChange={(_, newVal) => {
                                                                handleAdd(_, newVal, onChange);
                                                            }}
                                                            onInputChange={(event, newVal) => {
                                                                if (event !== null && newVal?.length) {
                                                                    setValue('companyUser', null);
                                                                    onChange(newVal);
                                                                }
                                                            }}
                                                            placeholder={t('Experience.name')}
                                                            options={companyList.data?.list ?? []}
                                                            getOptionLabel={(option) => option.name ?? ''}
                                                            renderOption={(option) => `${option.name ?? '-'}`}
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.companyName?.message} />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-6 ">
                                    <div className="submit-field">
                                        <Controller
                                            name="title"
                                            control={control}
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('Experience.title')}
                                                    component={
                                                        <Input
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder={t('Experience.title')}
                                                            fullWidth
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.title?.message} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-md-6 ">
                                    <div className="submit-field">
                                        <Controller
                                            name="startingDate"
                                            rules={{
                                                validate: (value) =>
                                                    validateMandatory(
                                                        value
                                                            ? moment(value, 'DD.MM.YYYY').format('YYYY-MM-DD')
                                                            : value,
                                                        t,
                                                    ),
                                            }}
                                            control={control}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('Common:FormInputs.startingDate.label')}
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
                                        <ValidationError error={errors?.startingDate?.message} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-6 ">
                                    <div className="submit-field">
                                        <Controller
                                            name="endDate"
                                            control={control}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('Common:FormInputs.endDate.label')}
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
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-md-6 col-xl-6">
                                    <div className="submit-field">
                                        <Controller
                                            name="jobType"
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
                                                            getOptionLabel={(option) => t(`Common:JobType.${option}`)}
                                                            renderOption={(option) => t(`Common:JobType.${option}`)}
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.jobType?.message} />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-6 ">
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
                                                            placeholder={t('Common:FormInputs.description.label')}
                                                            multiline
                                                            rows={2}
                                                            rowsMax={4}
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.description?.message} />
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
                        onClick={handleSubmitForm}
                        className={btnClasses.root}
                        variant="contained"
                        color="secondary"
                        component="span"
                    >
                        {t('Common:Action.SAVE')}
                    </Button>
                </div>
            }
        />
    );
};
ExperienceModal.displayName = 'ExperienceModal';
