/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { Button, Box, Grid, GridListTile, useTheme, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Input } from 'ui-kit/Input';
import { ArrowRightAlt, MailOutline } from '@material-ui/icons';
import { useAsyncData } from 'app/hooks';
import { Loading } from 'ui-kit/Loading';
import { isError, isPending, isSuccess } from 'utils';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { validateEmail } from 'utils/validateAuth';
import { Trans, useTranslation } from 'react-i18next';
import { ValidationError } from 'ui-kit/ValidationError';
import { AuthService } from 'app/services/Auth';

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
    signinShorcut: {
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
        marginTop: 8,
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
}

export const ForgotPasswordPanel: React.FC<IProps> = ({ setTabValue }) => {
    const classes = useStyles();
    const { t } = useTranslation(['Auth', 'Common']);
    const { handleSubmit, errors, control } = useForm<{ email: string; password: string }>({
        defaultValues: {
            email: null,
        },
    });
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const [forgotPassword, setForgotPassword] = useAsyncData<void>();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const handleSubmitForm = handleSubmit((model) => {
        const { email } = model;
        setForgotPassword(() => AuthService.attempForgotPassword(email));
    });

    React.useEffect(() => {
        if (isSuccess(forgotPassword)) {
            enqueueSnackbar(t('Notifications.checkMail'), {
                variant: 'success',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        } else if (isError(forgotPassword)) {
            enqueueSnackbar(forgotPassword.error.message, {
                variant: 'error',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        }
    }, [forgotPassword]);

    return (
        <>
            <Loading visible={isPending(forgotPassword)} />
            <Grid style={isDesktop ? { padding: '0 35px' } : {}} container>
                <GridListTile classes={{ root: classes.gridListTile }}>
                    <Box color="#333" fontWeight="bold" fontSize="1.6rem">
                        {t('forgotPassword.title')}
                    </Box>
                    <Box className={classes.gridListSubTitle} color="#808080" fontSize="1rem">
                        <Trans
                            ns="Auth"
                            i18nKey="forgotPassword.question"
                            components={[
                                <Box
                                    className={classes.signinShorcut}
                                    onClick={() => setTabValue(0)}
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
                        startAdornment={<MailOutline />}
                        rules={{ validate: (value) => validateEmail(value, t) }}
                        placeholder={t('Common:FormInputs.email.placeholder')}
                    />
                    <ValidationError error={errors?.email?.message} />
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
                        {t('Common:Action.SEND')}
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};
ForgotPasswordPanel.displayName = 'ForgotPasswordPanel';
