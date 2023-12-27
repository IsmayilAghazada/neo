/* eslint-disable no-nested-ternary */
import { Box, Button, CircularProgress, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import { DateInput } from 'ui-kit/DatePicker';
import { Input } from 'ui-kit/Input';
import { EGender } from 'enums';
import * as React from 'react';
import { Field } from 'ui-kit/Form/Field';
import { useTranslation } from 'react-i18next';
import { MuiModal } from 'ui-kit/Modal';
import { IAsyncData } from 'model';
import { IRecruiter } from 'app/models/Recruiter';
import { Controller, useForm } from 'react-hook-form';
import { useAsyncData, useDependencies, useLang } from 'app/hooks';
import { isLoading, isPending, isError, isSuccess } from 'utils';
import { range } from 'lodash';
import { Alert, Skeleton } from '@material-ui/lab';
import { RecruiterService } from 'app/services/Recruiter';
import { useBtnStyles } from 'ui-kit/Button';
import moment from 'moment';
import { validateMandatory } from 'utils/validateAuth';
import { ValidationError } from 'ui-kit/ValidationError';

interface IProps {
    opened: boolean;
    onClose: () => void;
    initialData: IAsyncData<IRecruiter>;
}
export const RecruiterInfoModal: React.FC<IProps> = ({ opened, onClose, initialData }) => {
    const { t } = useTranslation(['Profile', 'Common']);
    const btnClasses = useBtnStyles();
    const { messageBus } = useDependencies();
    const { currentLang } = useLang();
    const [recruiterInfo, setRecruiter] = useAsyncData<IRecruiter>();
    const { control, reset, handleSubmit, errors } = useForm<IRecruiter>({
        defaultValues: {
            firstName: null,
            lastName: null,
            birthDay: null,
            gender: EGender.FEMALE,
        },
    });
    const handleSubmitForm = handleSubmit((model) => {
        const birthDay = model.birthDay ? moment(model?.birthDay, 'DD.MM.YYYY').format('YYYY-MM-DD') : null;
        setRecruiter(() => RecruiterService.edit(initialData.data.id, { ...model, birthDay }));
    });

    React.useEffect(() => {
        if (isSuccess(recruiterInfo)) {
            messageBus.publish({ type: 'MY_INFO_MODAL', payload: false });
        }
    }, [recruiterInfo]);

    React.useEffect(() => {
        if (isSuccess(initialData)) {
            reset({
                firstName: initialData.data.firstName ?? null,
                lastName: initialData.data.lastName ?? null,
                birthDay: initialData.data.birthDay
                    ? moment(initialData.data.birthDay, 'YYYY-MM-DD').format('DD.MM.YYYY')
                    : null,
                gender: initialData.data.gender ?? EGender.FEMALE,
            });
        }
    }, [initialData]);

    return (
        <MuiModal
            size="lg"
            opened={opened}
            onClose={onClose}
            divider
            header={
                <Typography component="div">
                    <Box color="#333" fontSize="1.7rem" fontWeight="fontWeightBold" mt={1} ml={2} mr={1} mb={1}>
                        {t('titles.profileInfo')}
                    </Box>
                </Typography>
            }
            body={
                <div className="margin-top-24 margin-right-24 margin-bottom-24 margin-left-24">
                    {isLoading(initialData) ||
                        (isPending(recruiterInfo) && (
                            <div className="row">
                                {range(4).map((_, i) => (
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
                        ))}
                    {!isLoading(initialData) && !isPending(recruiterInfo) && (
                        <>
                            {isError(recruiterInfo) && (
                                <div className="row">
                                    <div className="col-xs-12 col-md-12 col-xl-12">
                                        <div className="submit-field">
                                            <Alert severity="error">{recruiterInfo.error.message}</Alert>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="row padding-24">
                                <div className="col-xs-12 col-md-6 col-xl-6">
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

                                <div className="col-xs-12 col-md-6  col-xl-6">
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

                                <div className="col-xs-12 col-md-6 col-xl-6">
                                    <div className="submit-field">
                                        <Controller
                                            name="birthDay"
                                            rules={{
                                                validate: (value) =>
                                                    validateMandatory(
                                                        value
                                                            ? moment(value, 'YYYY-MM-DD').format('DD.MM.YYYY')
                                                            : value,
                                                        t,
                                                    ),
                                            }}
                                            control={control}
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

                                <div className="col-xs-12 col-md-6 col-xl-6">
                                    <div className="submit-field">
                                        <Controller
                                            name="gender"
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
                                            control={control}
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
                            </div>
                        </>
                    )}
                </div>
            }
            footer={
                <div className="margin-top-24 margin-bottom-24 margin-right-24 margin-left-24">
                    <Button
                        onClick={(isLoading(initialData) || !isPending(recruiterInfo)) && handleSubmitForm}
                        className={btnClasses.root}
                        variant="contained"
                        color="secondary"
                    >
                        {isLoading(initialData) || isPending(recruiterInfo) ? (
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
RecruiterInfoModal.displayName = 'RecruiterInfoModal';
