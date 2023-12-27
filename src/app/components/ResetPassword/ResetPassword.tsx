import { Button, CircularProgress, IconButton, InputAdornment } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Input } from 'ui-kit/Input';
import React from 'react';
import { Field } from 'ui-kit/Form/Field';
import './index.scss';
import { Controller, useForm } from 'react-hook-form';
import { validatePassword, validateRepeatPassword } from 'utils/validateAuth';
import { useTranslation } from 'react-i18next';
import { ValidationError } from 'ui-kit/ValidationError';
import { useParams } from 'react-router-dom';
import { useAsyncData } from 'app/hooks';
import { isError, isPending, isSuccess } from 'utils';
import { useSnackbar } from 'notistack';
import { AuthService } from 'app/services/Auth';
import { useBtnStyles } from 'ui-kit/Button';

export const ResetPasswordForm: React.FC = () => {
    const { t } = useTranslation('Common');
    const btnClasses = useBtnStyles();
    const [state, setValues] = React.useState({
        new: false,
        repeat: false,
    });
    const { enqueueSnackbar } = useSnackbar();
    const [changePassword, setChangedPassword] = useAsyncData();
    const { token } = useParams<{ token: string }>();

    const { control, handleSubmit, getValues, errors } = useForm<any>({
        mode: 'onBlur',
        defaultValues: {
            newPassword: null,
            repeatNewPassword: null,
            token: null,
        },
    });

    React.useEffect(() => {
        if (isSuccess(changePassword)) {
            enqueueSnackbar(t('Common:Success.default'), {
                variant: 'success',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        } else if (isError(changePassword)) {
            enqueueSnackbar(changePassword.error.message, {
                variant: 'error',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        }
    }, [changePassword]);

    const handleSubmitForm = handleSubmit((model) => {
        const { newPassword } = model;
        setChangedPassword(() => AuthService.changePasswordByLink(newPassword, token));
    });

    return (
        <>
            <div className="row">
                <div className="col-xl-4">
                    <div className="submit-field">
                        <Controller
                            name="newPassword"
                            control={control}
                            rules={{
                                validate: (value) => validatePassword(value, t),
                            }}
                            render={({ value, onChange }) => (
                                <Field
                                    label={t('FormInputs.newPassword.label')}
                                    component={
                                        <Input
                                            value={value}
                                            onChange={onChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => {
                                                            setValues((x) => ({ ...x, new: !x.new }));
                                                        }}
                                                        edge="end"
                                                    >
                                                        {state.new ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            type={state.new ? 'text' : 'password'}
                                            placeholder={t('FormInputs.newPassword.label')}
                                            fullWidth
                                        />
                                    }
                                />
                            )}
                        />
                        <ValidationError error={errors?.newPassword?.message} />
                    </div>
                </div>

                <div className="col-xl-4">
                    <div className="submit-field">
                        <Controller
                            name="repeatNewPassword"
                            control={control}
                            rules={{
                                validate: (value) => validateRepeatPassword(getValues('newPassword'), value, t),
                            }}
                            render={({ value, onChange }) => (
                                <Field
                                    label={t('FormInputs.repeatNewPassword.label')}
                                    component={
                                        <Input
                                            value={value}
                                            onChange={onChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => {
                                                            setValues((x) => ({ ...x, repeat: !x.repeat }));
                                                        }}
                                                        edge="end"
                                                    >
                                                        {state.repeat ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            type={state.repeat ? 'text' : 'password'}
                                            placeholder={t('FormInputs.repeatNewPassword.label')}
                                            fullWidth
                                        />
                                    }
                                />
                            )}
                        />
                        <ValidationError error={errors?.repeatNewPassword?.message} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-auto">
                    <Button
                        type="button"
                        onClick={!isPending(changePassword) && handleSubmitForm}
                        fullWidth
                        className={btnClasses.root}
                        variant="contained"
                        color="secondary"
                    >
                        {isPending(changePassword) ? (
                            <CircularProgress size="1.5rem" color="primary" />
                        ) : (
                            t('Action.APPROVE')
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
};
ResetPasswordForm.displayName = 'ResetPasswordForm';
