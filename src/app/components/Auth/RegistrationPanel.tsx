/* eslint-disable no-else-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';
import { Button, Box, Grid, GridListTile, useMediaQuery, Typography } from '@material-ui/core';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { Input } from 'ui-kit/Input';
import { ArrowRightAlt, Business, LockOutlined, MailOutline, Person, RecentActors } from '@material-ui/icons';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { EGender, ERole } from 'enums';
import moment from 'moment';
import { useAsyncData, useDependencies } from 'app/hooks';
import { isPending, isSuccess, isError } from 'utils';
import { Loading } from 'ui-kit/Loading';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import {
    validateCompanyName,
    validateEmail,
    validateFistName,
    validateLastName,
    validatePassword,
} from 'utils/validateAuth';
import { useTranslation } from 'react-i18next';
import { ValidationError } from 'ui-kit/ValidationError';
import { AuthService } from 'app/services/Auth';
import { FacebookButton } from './FacebookButton';
import { GooglePlusButton } from './GooglePlusButton';
import { MenuItem } from '../Layout/Menu/MenuItem';

const useStyles = makeStyles((theme) => ({
    fbBtn: {
        marginBottom: 12,
        flex: '0 0 100%',
        [theme.breakpoints.up('md')]: {
            marginBottom: 0,
            flex: '0 0 48%',
        },
    },
    ggBtn: {
        flex: '0 0 100%',
        [theme.breakpoints.up('md')]: {
            flex: '0 0 48%',
        },
    },
    gridListTile: {
        marginBottom: 32,
        listStyle: 'none',
        flex: 1,
        justifyContent: 'center',
        display: 'flex',
    },
    gridListSubTitle: {
        display: 'flex',
        justifyContent: 'center',
    },
    tgleRoot: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        color: 'rgba(0, 0, 0, 0.38)',
        '&:hover': {
            color: '#2A41E8',
            backgroundColor: 'rgba(42, 65, 232, 0.12)',
        },
        '&:first-child': { marginLeft: 0 },
        '&$selectedTgl': {
            color: '#2A41E8',
            backgroundColor: 'rgba(42, 65, 232, 0.12)',
            '&:hover': {
                color: '#2A41E8',
                backgroundColor: 'rgba(42, 65, 232, 0.12)',
            },
        },
    },
    selectedTgl: {},
    authBtn: {
        transition: theme.transitions.create('all', { duration: '5s' }),
        height: 48,
        marginTop: -8,
        '& [class*="iconSize"]': {
            display: 'none',
        },
        '&:hover': {
            '& [class*="iconSize"]': {
                display: 'flex',
            },
        },
    },
}));

const StyledToggleButtonGroup = withStyles((theme) => ({
    root: {
        width: '100%',
    },
    grouped: {
        margin: theme.spacing(0.5, 0.5, 2.5, 0.5),
        border: 'none',
        '&:not(:first-child)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-child': {
            borderRadius: theme.shape.borderRadius,
        },
    },
}))(ToggleButtonGroup);

export const RegistrationPanel: React.FC<{ sticky?: boolean }> = ({ sticky = true }) => {
    const classes = useStyles();
    const { modalService, messageBus } = useDependencies();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation(['Auth', 'Common']);
    const { handleSubmit, getValues, errors, control, watch } = useForm<{
        companyName: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: ERole;
    }>({
        defaultValues: {
            companyName: null,
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            role: ERole.JOBSEEKER,
        },
    });
    const roleSbscr = watch('role');
    const [loading, setLoading] = React.useState(false);
    const [register, setRegister] = useAsyncData();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const socialRegisterationHandler = (
        url: string,
        email: string,
        role: ERole,
        first_name: string,
        last_name: string,
        birthday: string,
        gender: EGender,
    ) => {
        AuthService.downloadPhoto(url)
            .then((res: any) => {
                setRegister(() =>
                    AuthService.registerViaSocial(
                        { email, role, social: true, first_name, last_name, birthday, gender },
                        new File([res.data], `${first_name}.jpeg`, {
                            lastModified: new Date().getDate(),
                            type: res.data.type,
                        }),
                    ),
                );
            })
            .catch(() => {
                setRegister(() =>
                    AuthService.registerViaSocial({
                        email,
                        role,
                        social: true,
                        first_name,
                        last_name,
                        birthday,
                        gender,
                    }),
                );
            });
    };

    const responseFacebook = (response: any) => {
        const { email, first_name = null, last_name = null } = response;
        const gender = response.gender === 'male' ? EGender.MALE : EGender.FEMALE;
        const birthday = response.birthday ? moment(response.birthday, 'MM/DD/YYYY').format('YYYY-MM-DD') : null;
        const role = getValues('role');
        socialRegisterationHandler(response.picture.data.url, email, role, first_name, last_name, birthday, gender);
    };

    const handleSubmitForm = handleSubmit((model) => {
        const { companyName, firstName, lastName, email, password, role } = model;
        setRegister(() => AuthService.register(companyName, firstName, lastName, email, password, role));
    });

    React.useEffect(() => {
        if (isSuccess(register)) {
            setLoading(false);
            messageBus.publish({ type: 'CONGRAT', payload: { confetti: true } });
            modalService.requestModal({
                body: (
                    <div
                        style={{ padding: 36, textAlign: 'center' }}
                        className="d-flex flex-column align-items-center justify-content-center"
                    >
                        <img src="/assets/images/success-tick.svg" alt="" />
                        <Typography style={{ marginTop: 24 }} component="div" variant="h5">
                            <Box textAlign="center" color="#333">
                                {t('Notifications.success')}
                            </Box>
                        </Typography>
                        <Typography style={{ marginTop: 12 }} component="div" variant="body1">
                            <Box textAlign="center" color="#333">
                                {t('Notifications.checkMail')}
                            </Box>
                        </Typography>
                        <Typography style={{ marginTop: 24 }} component="div" variant="h2">
                            <MenuItem
                                onClick={() => {
                                    modalService.requestModal({ opened: false, body: null });
                                    setTimeout(() => {
                                        messageBus.publish({ type: 'CONGRAT', payload: false });
                                    }, 500);
                                }}
                                to="/login"
                                name={t('Common:Action.LOGIN')}
                            />
                        </Typography>
                    </div>
                ),
            });
        } else if (isError(register)) {
            enqueueSnackbar(register.error.message, {
                variant: 'error',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
            setLoading(false);
        }
    }, [register]);

    const getGridStyle = () => {
        if (sticky) {
            if (isDesktop) {
                return { padding: '35px 35px 0 35px' };
            }
            return { padding: '0 12px' };
        } else {
            if (isDesktop) {
                return { padding: '0 35px' };
            }
            return { padding: 0 };
        }
    };

    const getFooterStyle = () => {
        if (sticky) {
            if (isDesktop) {
                return { position: 'sticky', padding: '0 35px 35px 35px' };
            }
            return { position: 'sticky', padding: '12px' };
        } else {
            if (!isDesktop) {
                return { padding: '0px' };
            }
            return {};
        }
    };

    return (
        <>
            <Loading visible={isPending(register) || loading} />
            <Grid style={getGridStyle()} container>
                <GridListTile classes={{ root: classes.gridListTile }}>
                    <Box color="#333" fontWeight="bold" fontSize="1.6rem">
                        {t('Register.title')}
                    </Box>
                </GridListTile>
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        name="role"
                        render={({ value, onChange }) => (
                            <StyledToggleButtonGroup
                                orientation={isDesktop ? 'horizontal' : 'vertical'}
                                size="medium"
                                value={value}
                                exclusive
                                onChange={(_: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
                                    if (newAlignment !== null) {
                                        onChange(newAlignment as ERole);
                                    }
                                }}
                            >
                                <ToggleButton
                                    classes={{ root: classes.tgleRoot, selected: classes.selectedTgl }}
                                    value={ERole.JOBSEEKER}
                                >
                                    <Box marginLeft={1}>{t('Common:Role.JOBSEEKER')}</Box>
                                </ToggleButton>
                                <ToggleButton
                                    classes={{ root: classes.tgleRoot, selected: classes.selectedTgl }}
                                    value={ERole.COMPANY}
                                >
                                    <Box marginLeft={1}>{t('Common:Role.COMPANY')}</Box>
                                </ToggleButton>
                                {/* <ToggleButton
                                    classes={{ root: classes.tgleRoot, selected: classes.selectedTgl }}
                                    value={ERole.RECRUITER}
                                >
                                    <Box marginLeft={1}>{t('Common:Role.RECRUITER')}</Box>
                                </ToggleButton> */}
                            </StyledToggleButtonGroup>
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        as={Input}
                        fullWidth
                        name="firstName"
                        startAdornment={<Person />}
                        rules={{ validate: (value) => validateFistName(value, t) }}
                        placeholder={t('Common:FormInputs.firstName.placeholder')}
                    />
                    <ValidationError error={errors?.email?.message} />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        as={Input}
                        fullWidth
                        name="lastName"
                        startAdornment={<RecentActors />}
                        rules={{ validate: (value) => validateLastName(value, t) }}
                        placeholder={t('Common:FormInputs.lastName.placeholder')}
                    />
                    <ValidationError error={errors?.email?.message} />
                </Grid>
                {(roleSbscr === ERole.COMPANY || roleSbscr === ERole.RECRUITER) && (
                    <>
                        <Grid item xs={12}>
                            <Controller
                                control={control}
                                as={Input}
                                fullWidth
                                name="companyName"
                                startAdornment={<Business />}
                                rules={{ validate: (value) => validateCompanyName(value, t) }}
                                placeholder={t('Common:FormInputs.companyName.placeholder')}
                            />
                            <ValidationError error={errors?.firstName?.message} />
                        </Grid>
                    </>
                )}
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        as={Input}
                        fullWidth
                        name="email"
                        startAdornment={<MailOutline />}
                        rules={{ validate: (value) => validateEmail(value, t) }}
                        placeholder={t('Common:FormInputs.email.placeholder')}
                    />
                    <ValidationError error={errors?.email?.message} />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        as={Input}
                        fullWidth
                        type="password"
                        name="password"
                        startAdornment={<LockOutlined />}
                        rules={{ validate: (value) => validatePassword(value, t) }}
                        placeholder={t('Common:FormInputs.password.placeholder')}
                    />
                    <ValidationError error={errors?.password?.message} />
                </Grid>
                <Grid item xs={12} style={{ marginTop: 16 }}>
                    <Button
                        onClick={handleSubmitForm}
                        className={classes.authBtn}
                        fullWidth
                        variant="contained"
                        color="secondary"
                        endIcon={<ArrowRightAlt />}
                    >
                        {t('Register.actions.register')}
                    </Button>
                </Grid>
            </Grid>
            {roleSbscr !== ERole.COMPANY && roleSbscr !== ERole.RECRUITER && (
                <div className="social__bottom" style={getFooterStyle() as React.CSSProperties}>
                    <div className="line-separate">
                        <span className="line-separate__inner">{t('Common:Lexical.or')}</span>
                    </div>
                    <div className="social-auth">
                        <FacebookButton
                            onClick={() => setLoading(true)}
                            responseHandler={responseFacebook}
                            fullWidth={!isDesktop}
                            className={classes.fbBtn}
                            text={t('Register.actions.fb')}
                        />
                        <GooglePlusButton
                            onClick={() => {
                                const role = getValues('role');
                                window.location.href = `/v1/auth/google?from=register&role=${role}`;
                            }}
                            fullWidth={!isDesktop}
                            className={classes.ggBtn}
                            text={t('Register.actions.google')}
                        />
                    </div>
                </div>
            )}
        </>
    );
};
