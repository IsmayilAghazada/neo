/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { Button, Box, Grid, GridListTile, useMediaQuery, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Input } from 'ui-kit/Input';
import { ArrowRightAlt, LockOutlined, MailOutline } from '@material-ui/icons';
import { useAsyncData, useDependencies } from 'app/hooks';
import { Loading } from 'ui-kit/Loading';
import { isError, isPending, isSuccess } from 'utils';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { validateEmail, validatePassword } from 'utils/validateAuth';
import { Trans, useTranslation } from 'react-i18next';
import { ValidationError } from 'ui-kit/ValidationError';
import { AuthService } from 'app/services/Auth';
import { ROUTES } from 'app/routes/consts';
import { useHistory } from 'react-router-dom';
import { CONTACT_NUMBER } from 'consts';
import { useBtnStyles } from 'ui-kit/Button';
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
        flexWrap: 'wrap',
    },
    signupShorcut: {
        marginLeft: 4,
        cursor: 'pointer',
        color: theme.palette.secondary.main,
        '&:hover': {
            color: '#333',
        },
    },
    forgotPassShorcut: {
        marginBottom: 26,
        cursor: 'pointer',
        color: '#888',
        '&:hover': {
            color: theme.palette.secondary.main,
        },
    },
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

export interface IProps {
    setTabValue: (val: number) => void;
    sticky?: boolean;
}

export const LoginPanel: React.FC<IProps> = ({ setTabValue, sticky = true }) => {
    const classes = useStyles();
    const btnClasses = useBtnStyles();
    const { t } = useTranslation(['Auth', 'Common']);
    const { handleSubmit, errors, control } = useForm<{ email: string; password: string }>({
        defaultValues: {
            email: null,
            password: null,
        },
    });
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const { push } = useHistory();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const [login, setLogin] = useAsyncData<string>();
    const { storage, forceUpdate, modalService, socketService } = useDependencies();
    const [loading, setLoading] = React.useState(false);
    const responseFacebook = (response: any) => {
        const { email } = response;
        setLogin(() => AuthService.login(email, undefined, true));
    };

    const handleSubmitForm = handleSubmit((model) => {
        const { email, password } = model;
        setLogin(() => AuthService.login(email, password));
    });

    React.useEffect(() => {
        if (storage.token.hasValue()) {
            push('/');
        }
    }, []);

    React.useEffect(() => {
        if (isSuccess(login)) {
            storage.token.setValue(login.data);
            // messageBus.publish({ type: 'AUTH_MODAL_REQ', payload: false });
            socketService.connect();
            push(ROUTES.HOME.PATH);
            forceUpdate({} as any);
        } else if (isError(login)) {
            if (login.error.code === 'BLOCKED') {
                modalService.requestModal({
                    body: (
                        <div
                            style={{ padding: 36 }}
                            className="d-flex flex-column align-items-center justify-content-center"
                        >
                            <img src="/assets/images/denied.svg" alt="" />
                            <Typography style={{ marginTop: 24 }} component="div" variant="h5">
                                <Box textAlign="center" color="#333">
                                    {t('Notifications.blocked')}
                                </Box>
                            </Typography>
                            <Typography style={{ marginTop: 12 }} component="div" variant="body1">
                                <Box textAlign="center" color="#333">
                                    {t('Common:Error.contactToGetInfo', { contacts: CONTACT_NUMBER })}
                                </Box>
                            </Typography>
                            <Typography style={{ marginTop: 24 }} component="div" variant="h2">
                                <MenuItem
                                    onClick={() => {
                                        modalService.requestModal({ opened: false, body: null });
                                    }}
                                    to="/login"
                                    name={t('Common:Action.CLOSE')}
                                />
                            </Typography>
                        </div>
                    ),
                });
            } else if (login.error.code === 'CONFIRM_ACCOUNT') {
                modalService.requestModal({
                    body: (
                        <div
                            style={{ padding: 36, textAlign: 'center' }}
                            className="d-flex flex-column align-items-center justify-content-center"
                        >
                            <img src="/assets/images/warning.svg" alt="" />
                            <Typography style={{ marginTop: 24 }} component="div" variant="h5">
                                <Box textAlign="center" color="#333">
                                    {t('Notifications.confirm')}
                                </Box>
                            </Typography>
                            <Typography style={{ marginTop: 12 }} component="div" variant="body1">
                                <Box textAlign="center" color="#333">
                                    {t('Notifications.checkMail')}
                                </Box>
                            </Typography>
                            <Typography style={{ marginTop: 24 }} component="div" variant="h2">
                                <Box textAlign="center" color="#333">
                                    <Button
                                        className={`${btnClasses.root}`}
                                        variant="contained"
                                        size="large"
                                        onClick={() => {
                                            modalService.requestModal({ opened: false, body: null });
                                        }}
                                    >
                                        {t('Common:Action.CLOSE')}
                                    </Button>
                                </Box>
                            </Typography>
                        </div>
                    ),
                });
            } else {
                enqueueSnackbar(login.error.message, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'center', vertical: 'top' },
                    autoHideDuration: 3000,
                });
                // messageBus.publish({ type: 'AUTH_MODAL_REQ', payload: false });
                forceUpdate({} as any);
            }
        }
    }, [login]);

    return (
        <>
            <Loading visible={isPending(login) || isError(login) || loading} />
            <Grid
                style={
                    sticky && isDesktop
                        ? { padding: '35px 35px 0 35px' }
                        : isDesktop
                        ? { padding: '0 35px' }
                        : { padding: 0 }
                }
                container
            >
                <GridListTile classes={{ root: classes.gridListTile }}>
                    <Box color="#333" fontWeight="bold" fontSize="1.6rem">
                        {t('Login.title')}
                    </Box>
                    <Box className={classes.gridListSubTitle} color="#808080" fontSize="1rem">
                        <Trans
                            ns="Auth"
                            i18nKey="Login.subTitle"
                            components={[
                                <Box
                                    className={classes.signupShorcut}
                                    onClick={() => setTabValue(1)}
                                    display="inline-block"
                                />,
                            ]}
                        />
                    </Box>
                </GridListTile>
                <Grid item xs={12}>
                    <Controller
                        control={control}
                        as={Input}
                        fullWidth
                        name="email"
                        margin="dense"
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
                <Grid item xs={12}>
                    <Box
                        fontSize=".9rem"
                        className={classes.forgotPassShorcut}
                        onClick={() => setTabValue(2)}
                        display="inline-block"
                    >
                        {t('Login.question')}
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        onClick={handleSubmitForm}
                        className={classes.authBtn}
                        fullWidth
                        variant="contained"
                        color="secondary"
                        endIcon={<ArrowRightAlt />}
                    >
                        {t('Common:Action.LOGIN')}
                    </Button>
                </Grid>
            </Grid>
            <div
                className="social__bottom"
                style={
                    sticky && isDesktop
                        ? { position: 'sticky', padding: '0 35px 35px 35px' }
                        : !isDesktop
                        ? { padding: 0 }
                        : {}
                }
            >
                <div className="line-separate" style={sticky ? { margin: '38px 0 15px 0 !important' } : {}}>
                    <span className="line-separate__inner">{t('Common:Lexical.or')}</span>
                </div>
                <div className="social-auth">
                    <FacebookButton
                        onClick={() => setLoading(true)}
                        responseHandler={responseFacebook}
                        fullWidth={!isDesktop}
                        className={classes.fbBtn}
                        text={t('Login.actions.fb')}
                    />
                    <GooglePlusButton
                        onClick={() => {
                            window.location.href = `/v1/auth/google?from=login`;
                        }}
                        fullWidth={!isDesktop}
                        className={classes.ggBtn}
                        text={t('Login.actions.google')}
                    />
                </div>
            </div>
        </>
    );
};
