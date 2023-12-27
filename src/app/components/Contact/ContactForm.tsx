import { Button, CircularProgress } from '@material-ui/core';
import { Input } from 'ui-kit/Input';
import React from 'react';
import { Field } from 'ui-kit/Form/Field';
import './index.scss';
import { Controller, useForm } from 'react-hook-form';
import { validateEmail, validateMandatory } from 'utils/validateAuth';
import { useTranslation } from 'react-i18next';
import { ValidationError } from 'ui-kit/ValidationError';
import { useAsyncData } from 'app/hooks';
import { isError, isPending, isSuccess } from 'utils';
import { useSnackbar } from 'notistack';
import { useBtnStyles } from 'ui-kit/Button';
import { TextArea } from 'ui-kit/Textarea';
import { IContact } from 'app/models/Contact';
import { ContactService } from 'app/services/Contact';

export const ContactForm: React.FC = () => {
    const { t } = useTranslation('Common');
    const btnClasses = useBtnStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [contact, setContact] = useAsyncData<IContact>();

    const { control, handleSubmit, errors } = useForm<IContact>({
        mode: 'onBlur',
        defaultValues: {
            fullname: null,
            email: null,
            subject: null,
            message: null,
        },
    });

    React.useEffect(() => {
        if (isSuccess(contact)) {
            enqueueSnackbar(t('Common:Success.default'), {
                variant: 'success',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        } else if (isError(contact)) {
            enqueueSnackbar(contact.error.message, {
                variant: 'error',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        }
    }, [contact]);

    const handleSubmitForm = handleSubmit((model) => {
        setContact(() => ContactService.save(model));
    });

    return (
        <>
            <div className="row">
                <div className="col-xl-6">
                    <div className="submit-field">
                        <Controller
                            name="fullname"
                            control={control}
                            rules={{
                                validate: (value) => validateMandatory(value, t),
                            }}
                            render={({ value, onChange }) => (
                                <Field
                                    component={
                                        <Input
                                            value={value}
                                            onChange={onChange}
                                            startAdornment={<i className="icon-material-outline-account-circle" />}
                                            type="text"
                                            placeholder={t('Common:FormInputs.fullname.label')}
                                            fullWidth
                                        />
                                    }
                                />
                            )}
                        />
                        <ValidationError error={errors?.fullname?.message} />
                    </div>
                </div>
                <div className="col-xl-6">
                    <div className="submit-field">
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                validate: (value) => validateEmail(value, t),
                            }}
                            render={({ value, onChange }) => (
                                <Field
                                    component={
                                        <Input
                                            value={value}
                                            onChange={onChange}
                                            startAdornment={<i className="icon-material-outline-email" />}
                                            type="text"
                                            placeholder={t('Common:FormInputs.email.label')}
                                            fullWidth
                                        />
                                    }
                                />
                            )}
                        />
                        <ValidationError error={errors?.email?.message} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-12">
                    <div className="submit-field">
                        <Controller
                            name="subject"
                            control={control}
                            rules={{
                                validate: (value) => validateMandatory(value, t),
                            }}
                            render={({ value, onChange }) => (
                                <Field
                                    component={
                                        <Input
                                            value={value}
                                            onChange={onChange}
                                            startAdornment={<i className="icon-material-outline-assignment" />}
                                            type="text"
                                            placeholder={t('Common:FormInputs.subject.label')}
                                            fullWidth
                                        />
                                    }
                                />
                            )}
                        />
                        <ValidationError error={errors?.subject?.message} />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-12">
                    <div className="submit-field">
                        <Controller
                            name="message"
                            control={control}
                            rules={{
                                validate: (value) => validateMandatory(value, t),
                            }}
                            render={({ value, onChange }) => (
                                <Field
                                    component={
                                        <TextArea
                                            value={value}
                                            onChange={onChange}
                                            variant="outlined"
                                            placeholder={t('Common:FormInputs.message.label')}
                                            multiline
                                            rows={4}
                                            rowsMax={6}
                                        />
                                    }
                                />
                            )}
                        />
                        <ValidationError error={errors?.message?.message} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-auto">
                    <Button
                        type="button"
                        onClick={!isPending(contact) && handleSubmitForm}
                        fullWidth
                        className={btnClasses.root}
                        variant="contained"
                        color="secondary"
                    >
                        {isPending(contact) ? <CircularProgress size="1.5rem" color="primary" /> : t('Action.SEND')}
                    </Button>
                </div>
            </div>
        </>
    );
};
ContactForm.displayName = 'ContactForm';
