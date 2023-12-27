import { Button, IconButton, InputAdornment } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Input } from 'ui-kit/Input';
import React from 'react';
import { Field } from 'ui-kit/Form/Field';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { useAsyncData } from 'app/hooks';
import { isError, isPending, isSuccess } from 'utils';
import { AuthService } from 'app/services/Auth';
import { validatePassword, validateRepeatPassword } from 'utils/validateAuth';
import { ValidationError } from 'ui-kit/ValidationError';
import { Loading } from 'ui-kit/Loading';
import { useBtnStyles } from 'ui-kit/Button';

interface ISecurityForm {
    current: string;
    newPass: string;
    repeatNew: string;
}

export const Security: React.FC = () => {
    const { t } = useTranslation(['Profile', 'Common']);
    const btnClasses = useBtnStyles();
    const [state, setValues] = React.useState({
        current: false,
        newPass: false,
        repeatNew: false,
    });
    const { enqueueSnackbar } = useSnackbar();
    const [changePassword, setChangedPassword] = useAsyncData();

    const { control, handleSubmit, getValues, errors } = useForm<ISecurityForm>({
        mode: 'onBlur',
        defaultValues: {
            current: null,
            newPass: null,
            repeatNew: null,
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
        const { newPass, current } = model;
        setChangedPassword(() => AuthService.chagePassword(current, newPass));
    });

    return (
        <Loading visible={isPending(changePassword)} fullPage={false}>
            <div className="headline">
                <h3>
                    <i className="icon-material-outline-lock" /> {t('titles.security')}
                </h3>
            </div>
            <div className="content with-padding">
                <div className="row">
                    <div className="col-xl-4">
                        <div className="submit-field">
                            <Controller
                                name="current"
                                control={control}
                                rules={{
                                    validate: (value) => validatePassword(value, t),
                                }}
                                render={({ value, onChange }) => (
                                    <Field
                                        label={t('Common:FormInputs.currentPassword.label')}
                                        component={
                                            <Input
                                                value={value ?? ''}
                                                onChange={onChange}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => {
                                                                setValues((x) => ({ ...x, current: !x.current }));
                                                            }}
                                                            edge="end"
                                                        >
                                                            {state.current ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                type={state.current ? 'text' : 'password'}
                                                placeholder={t('Common:FormInputs.currentPassword.label')}
                                                fullWidth
                                            />
                                        }
                                    />
                                )}
                            />
                            <ValidationError error={errors?.current?.message} />
                        </div>
                    </div>
                    <div className="col-xl-4">
                        <div className="submit-field">
                            <Controller
                                name="newPass"
                                control={control}
                                rules={{
                                    validate: (value) => validatePassword(value, t),
                                }}
                                render={({ value, onChange }) => (
                                    <Field
                                        label={t('Common:FormInputs.newPassword.label')}
                                        component={
                                            <Input
                                                value={value ?? ''}
                                                onChange={onChange}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => {
                                                                setValues((x) => ({ ...x, newPass: !x.newPass }));
                                                            }}
                                                            edge="end"
                                                        >
                                                            {state.newPass ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                type={state.newPass ? 'text' : 'password'}
                                                placeholder={t('Common:FormInputs.newPassword.label')}
                                                fullWidth
                                            />
                                        }
                                    />
                                )}
                            />
                            <ValidationError error={errors?.newPass?.message} />
                        </div>
                    </div>

                    <div className="col-xl-4">
                        <div className="submit-field">
                            <Controller
                                name="repeatNew"
                                control={control}
                                rules={{
                                    validate: (value) => validateRepeatPassword(getValues('newPass'), value, t),
                                }}
                                render={({ value, onChange }) => (
                                    <Field
                                        label={t('Common:FormInputs.repeatNewPassword.label')}
                                        component={
                                            <Input
                                                value={value ?? ''}
                                                onChange={onChange}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => {
                                                                setValues((x) => ({ ...x, repeatNew: !x.repeatNew }));
                                                            }}
                                                            edge="end"
                                                        >
                                                            {state.repeatNew ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                type={state.repeatNew ? 'text' : 'password'}
                                                placeholder={t('Common:FormInputs.repeatNewPassword.label')}
                                                fullWidth
                                            />
                                        }
                                    />
                                )}
                            />
                            <ValidationError error={errors?.repeatNew?.message} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-auto">
                        <Button
                            onClick={handleSubmitForm}
                            fullWidth
                            className={btnClasses.root}
                            variant="contained"
                            color="secondary"
                            component="span"
                        >
                            {t('Common:Action.SAVE')}
                        </Button>
                    </div>
                </div>
            </div>
        </Loading>
    );
};
