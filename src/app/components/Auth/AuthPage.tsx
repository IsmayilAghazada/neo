import * as React from 'react';
import { Box, Button, Container, Grid, makeStyles, Tabs, Typography } from '@material-ui/core';
import { StyledTab } from 'ui-kit/Tab/StyledTab';
import { TabPanel } from 'ui-kit/Tab/TabPanel';
import { useHistory } from 'react-router-dom';
import { ROUTES } from 'app/routes/consts';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useDependencies } from 'app/hooks';
import { useBtnStyles } from 'ui-kit/Button';
import { LoginPanel } from './LoginPanel';
import { RegistrationPanel } from './RegistrationPanel';
import { ForgotPasswordPanel } from './ForgotPasswordPanel';
import { MenuItem } from '../Layout/Menu/MenuItem';

import './index.scss';

const useStyles = makeStyles(() => ({
    grow: {
        flexGrow: 1,
    },
    root: {
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
        margin: 0,
        paddingBottom: 64,
    },
}));
const AuthPage: React.FC = () => {
    const classes = useStyles();
    const btnClasses = useBtnStyles();
    const { t } = useTranslation(['Auth']);
    const { modalService, messageBus } = useDependencies();
    const {
        location: { pathname },
        push,
    } = useHistory();
    const AUTHRoutes = [ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTER, ROUTES.AUTH.FORGOT_PASSWORD];
    const handleTabChange = (_: React.MouseEvent, newValue: number) => {
        push(AUTHRoutes[newValue]);
    };
    const { enqueueSnackbar } = useSnackbar();
    const setTabValue = (newValue: number) => {
        push(AUTHRoutes[newValue]);
    };

    React.useEffect(() => {
        const authData = localStorage.getItem('authData') as any;
        localStorage.removeItem('authData');
        if (authData) {
            const getParsedAuthData = JSON.parse(authData);
            if (getParsedAuthData.error) {
                if (getParsedAuthData.error === 'CONFIRM_ACCOUNT') {
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
                    enqueueSnackbar(t(`Error.${getParsedAuthData.error}`), {
                        variant: 'error',
                        anchorOrigin: { horizontal: 'center', vertical: 'top' },
                        autoHideDuration: 3000,
                    });
                }
            } else if (getParsedAuthData.from === 'register') {
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
            }
        }
    }, []);

    return (
        <Grid container className={classes.root}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{pathname.replace('/', '').toUpperCase()}</title>
            </Helmet>
            <Container>
                <div className="row justify-content-center">
                    <div className="col-xl-6">
                        <div className="dashboard-box">
                            <Tabs
                                variant="scrollable"
                                value={AUTHRoutes.findIndex((x) => x === pathname)}
                                indicatorColor="secondary"
                                textColor="secondary"
                                onChange={handleTabChange}
                            >
                                <StyledTab label={t('tabs.login')} />
                                <StyledTab label={t('tabs.register')} />
                            </Tabs>
                            <div className="content with-padding">
                                <TabPanel scrollable={false} value={pathname} index={AUTHRoutes[0]}>
                                    <LoginPanel sticky={false} setTabValue={setTabValue} />
                                </TabPanel>
                                <TabPanel scrollable={false} value={pathname} index={AUTHRoutes[1]}>
                                    <RegistrationPanel sticky={false} />
                                </TabPanel>
                                <TabPanel scrollable={false} value={pathname} index={AUTHRoutes[2]}>
                                    <ForgotPasswordPanel setTabValue={setTabValue} />
                                </TabPanel>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Grid>
    );
};
AuthPage.displayName = 'AuthPage';
export default AuthPage;
