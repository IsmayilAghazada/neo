import { Input } from 'ui-kit/Input';
import React from 'react';
import { Field } from 'ui-kit/Form/Field';
import { DateInput } from 'ui-kit/DatePicker';
import { ArrayField, Controller, useForm } from 'react-hook-form';
import { IEducation } from 'app/models/JobSeeker';
import { MuiModal } from 'ui-kit/Modal';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useAsyncData, useLang } from 'app/hooks';
import { isError, isPending, isSuccess } from 'utils';
import { Alert, Skeleton } from '@material-ui/lab';
import { range } from 'lodash';
import { EducationService } from 'app/services/JobSeeker/Education';
import { useBtnStyles } from 'ui-kit/Button';
import moment from 'moment';
import { ValidationError } from 'ui-kit/ValidationError';
import { validateMandatory } from 'utils/validateAuth';
import { ProfileContext } from '../ProfileContext';

interface IProps {
    opened: boolean;
    initialData?: Partial<ArrayField<IEducation, 'fieldId'>>;
    onClose: () => void;
    onSave: (data: IEducation, index?: number) => void;
}

export const EducationModal: React.FC<IProps> = ({ opened, onClose, initialData, onSave }) => {
    const { t } = useTranslation(['Profile', 'Common']);
    const theme = useTheme();
    const btnClasses = useBtnStyles();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const { clientData } = React.useContext(ProfileContext);
    const { control, handleSubmit, reset, errors } = useForm<IEducation>({
        defaultValues: {
            id: null,
            certificateDegreeName: null,
            major: null,
            startingDate: null,
            completionDate: null,
            jobSeeker: null,
        },
    });
    const { currentLang } = useLang();
    const [education, setEducation] = useAsyncData<IEducation>();
    const handleSubmitForm = handleSubmit((model) => {
        const startingDate = model.startingDate ? moment(model.startingDate, 'DD.MM.YYYY').format('YYYY-MM-DD') : null;
        const completionDate = model.completionDate
            ? moment(model.completionDate, 'DD.MM.YYYY').format('YYYY-MM-DD')
            : null;
        setEducation(() =>
            EducationService.save(clientData?.data?.id, {
                ...model,
                startingDate,
                completionDate,
                jobSeeker: clientData?.data?.id,
            }),
        );
    });

    React.useEffect(() => {
        if (isSuccess(education)) {
            onSave(education.data, initialData?.id || null);
        }
    }, [education]);

    React.useEffect(() => {
        if (initialData !== null) {
            reset({ ...initialData });
        } else {
            reset({
                id: null,
                certificateDegreeName: null,
                major: null,
                startingDate: null,
                completionDate: null,
                jobSeeker: null,
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
                    <Box
                        alignSelf="center"
                        color="#333"
                        fontSize={isDesktop ? '1.7rem' : '1rem'}
                        fontWeight="fontWeightBold"
                        m={1}
                    >
                        {t('titles.education')}
                    </Box>
                </Typography>
            }
            body={
                <>
                    {isPending(education) && (
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
                    {!isPending(education) && (
                        <>
                            {isError(education) && (
                                <div className="row">
                                    <div className="col-xs-12 col-md-12 col-xl-12">
                                        <div className="submit-field">
                                            <Alert severity="error">{education.error.message}</Alert>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="row">
                                <div className="col-xs-12 col-md-6 col-xl-6">
                                    <div className="submit-field">
                                        <Controller control={control} name="id" render={() => null} />
                                        <Controller
                                            name="universityName"
                                            control={control}
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('Education.name')}
                                                    component={
                                                        <Input
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder={t('Education.name')}
                                                            fullWidth
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.universityName?.message} />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-6 ">
                                    <div className="submit-field">
                                        <Controller
                                            name="major"
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
                                            control={control}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('Education.major')}
                                                    component={
                                                        <Input
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder={t('Education.major')}
                                                            fullWidth
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.major?.message} />
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
                                            name="completionDate"
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
                                            name="certificateDegreeName"
                                            control={control}
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('Education.degree')}
                                                    component={
                                                        <Input
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder={t('Education.degree')}
                                                            fullWidth
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.certificateDegreeName?.message} />
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
EducationModal.displayName = 'EducationModal';
