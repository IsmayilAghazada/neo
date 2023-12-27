import * as React from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ResetPasswordForm } from './ResetPassword';

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

const ResetPassword: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation(['Auth']);

    return (
        <Grid container className={classes.root}>
            <Container>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="dashboard-box">
                            <div className="headline">
                                <h3>
                                    <i className="icon-material-outline-lock" /> {t('resetPassword.title')}
                                </h3>
                            </div>
                            <div className="content with-padding">
                                <ResetPasswordForm />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Grid>
    );
};
ResetPassword.displayName = 'ResetPassword';
export default ResetPassword;
