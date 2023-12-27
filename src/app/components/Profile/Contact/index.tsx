import { Box, Button, createStyles, makeStyles, Typography } from '@material-ui/core';
import { Input } from 'ui-kit/Input';
import { PhoneNumber } from 'ui-kit/PhoneInput';
import * as React from 'react';
import { Field } from 'ui-kit/Form/Field';
import { ProfilePhoto } from 'app/components/Profile/ProfilePhoto';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { validateEmail, validateMandatory } from 'utils/validateAuth';
import { useAsyncData, useDependencies } from 'app/hooks';
import { ValidationError } from 'ui-kit/ValidationError';
import { Loading } from 'ui-kit/Loading';
import { isError, isPending, isSuccess } from 'utils';
import { BACKEND_BASE_URL } from 'consts';
import { useHistory } from 'react-router-dom';
import { ROUTES } from 'app/routes/consts';
import { useBtnStyles } from 'ui-kit/Button';
import { Alert } from '@material-ui/lab';
import { ProfileContext } from '../ProfileContext';

const useStyles = makeStyles(() =>
    createStyles({
        header: {
            display: 'flex !important',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '11px 30px  !important',
        },
    }),
);

interface IContactForm {
    logo: string;
    email: string;
    contactNumber: string;
}

export const ContactInfo: React.FC = () => {
    const { t } = useTranslation(['Profile', 'Common']);
    const { userService, messageBus } = useDependencies();
    const classes = useStyles();
    const btnClasses = useBtnStyles();
    const {
        location: { pathname },
    } = useHistory();
    const { userData } = React.useContext(ProfileContext);
    const user = userData.data;
    const [userContactInfo, setContactInfo] = useAsyncData();

    React.useEffect(() => {
        if (pathname !== ROUTES.PROFILE.PATH) {
            setContactInfo(() => Promise.resolve(userData.data));
        }
    }, []);

    React.useEffect(() => {
        if (isSuccess(userContactInfo) && pathname === ROUTES.PROFILE.PATH) {
            messageBus.publish({ type: 'GET_USER_SUCCESS', payload: { ...userContactInfo } });
        }
    }, [userContactInfo]);

    const params = useForm<IContactForm>({
        mode: 'onBlur',
        defaultValues: {
            logo: user?.imageUrl ? `${BACKEND_BASE_URL}/${user?.imageUrl}` : null,
            email: user?.email,
            contactNumber: user?.contactNumber,
        },
    });
    const { control, errors } = params;
    const handleSubmitForm = params.handleSubmit((model) => {
        const { logo, ...rest } = model;
        setContactInfo(() => userService.editUser(user?.id, rest, logo?.length ? undefined : logo));
    });

    return (
        <FormProvider {...params}>
            <div className={`headline ${classes.header}`}>
                <h3>
                    <i className="icon-material-outline-account-circle" /> {t('titles.contactInfo')}
                </h3>
                <span className="dashboard-status-button green">{t(`Common:Role.${user.role}`)}</span>
            </div>

            <div className="content with-padding padding-bottom-0">
                {isError(userContactInfo) && (
                    <div className="row">
                        <div className="col-xs-12 col-md-12 col-xl-12">
                            <div className="submit-field">
                                <Alert severity="error">{userContactInfo.error.message}</Alert>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex-sm-row flex-md-row flex-lg-row d-lg-flex">
                    <Loading visible={isPending(userContactInfo)} />
                    <div className="flex col-sm-auto col margin-right-12 margin-bottom-24 justify-content-center">
                        <ProfilePhoto mode={pathname === ROUTES.PROFILE.PATH ? 'creat' : 'view'} />
                    </div>
                    <div className={`col ${pathname !== ROUTES.PROFILE.PATH && 'align-self-center'}`}>
                        {pathname === ROUTES.PROFILE.PATH ? (
                            <>
                                <div className="row">
                                    <div className="col-xs-12 col-md-6 col-xl-6">
                                        <div className="submit-field">
                                            <Controller
                                                control={control}
                                                name="email"
                                                render={({ value, onChange }) => (
                                                    <Field
                                                        label={t('Common:FormInputs.email.label')}
                                                        component={
                                                            <Input
                                                                placeholder={t('Common:FormInputs.email.placeholder')}
                                                                fullWidth
                                                                value={value}
                                                                onChange={onChange}
                                                            />
                                                        }
                                                    />
                                                )}
                                                rules={{ validate: (value) => validateEmail(value, t) }}
                                            />
                                            <ValidationError error={errors?.email?.message} />
                                        </div>
                                    </div>

                                    <div className="col-xs-12 col-md-6 col-xl-6">
                                        <div className="submit-field">
                                            <Controller
                                                control={control}
                                                render={({ value, onChange }) => (
                                                    <Field
                                                        label={t('Common:FormInputs.phoneNumber.label')}
                                                        component={<PhoneNumber value={value} onChange={onChange} />}
                                                    />
                                                )}
                                                name="contactNumber"
                                                rules={{
                                                    validate: (value) => validateMandatory(value, t),
                                                }}
                                            />
                                            <ValidationError error={errors?.contactNumber?.message} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-auto">
                                        <div className="submit-field">
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
                            </>
                        ) : (
                            <div className="row">
                                <div className="col-xs-12 col-md-6 col-xl-6">
                                    <div className="submit-field">
                                        <Field
                                            label={t('Common:FormInputs.email.label')}
                                            component={
                                                <Typography component="div">
                                                    <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                                        {user.email}
                                                    </Box>
                                                </Typography>
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-6 col-xl-6">
                                    <div className="submit-field">
                                        <Field
                                            label={t('Common:FormInputs.phoneNumber.label')}
                                            component={
                                                <Typography component="div">
                                                    <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                                        {user.contactNumber ? `+${user.contactNumber}` : <>&mdash;</>}
                                                    </Box>
                                                </Typography>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </FormProvider>
    );
};
ContactInfo.displayName = 'ContactInfo';
