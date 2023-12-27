import * as React from 'react';
import { Box, CircularProgress, Container, Grid, makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import './index.scss';
import { useParams } from 'react-router-dom';
import { useAsyncData } from 'app/hooks';
import { isError, isLoading, isSuccess } from 'utils';
import { AuthService } from 'app/services/Auth';
import { Alert } from '@material-ui/lab';
import { MenuItem } from '../Layout/Menu/MenuItem';

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
const ConfirmAccount: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation(['Auth']);
    const { token } = useParams<{ token: string }>();
    const [confirmAccount, setConfirmAccount] = useAsyncData();

    React.useEffect(() => {
        setConfirmAccount(() => AuthService.confirmAccountByLink(token));
    }, []);

    return (
        <Grid container className={classes.root}>
            <Container>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="dashboard-box">
                            <div className="headline">
                                <h3>
                                    <i className="icon-material-outline-lock" /> {t('confirmAccount.title')}
                                </h3>
                            </div>
                            <div className="content with-padding">
                                <div className="row">
                                    <div className="col-12">
                                        {isLoading(confirmAccount) && (
                                            <CircularProgress size="1.5rem" color="primary" />
                                        )}
                                        {isSuccess(confirmAccount) && (
                                            <div
                                                style={{ padding: 36 }}
                                                className="flex flex-column align-items-center justify-content-center"
                                            >
                                                <img src="/assets/images/success-tick.svg" alt="" />
                                                <Typography style={{ marginTop: 24 }} component="div" variant="h5">
                                                    <Box textAlign="center" color="#333">
                                                        {t('confirmAccount.body')}
                                                    </Box>
                                                </Typography>
                                                <Typography style={{ marginTop: 24 }} component="div" variant="h2">
                                                    <MenuItem to="/login" name={t('Common:Action.LOGIN')} />
                                                </Typography>
                                            </div>
                                        )}
                                        {isError(confirmAccount) && (
                                            <div className="submit-field">
                                                <Alert severity="error">{confirmAccount.error.message}</Alert>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Grid>
    );
};
ConfirmAccount.displayName = 'ConfirmAccount';
export default ConfirmAccount;
