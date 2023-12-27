import * as React from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';

import './index.scss';
import { Loading } from 'ui-kit/Loading';
import { socketService, storage } from 'app/deps';
import { Redirect } from 'react-router-dom';
import { ROUTES } from 'app/routes/consts';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
        margin: 0,
        paddingBottom: 64,
    },
}));
const Logout: React.FC = () => {
    const classes = useStyles();
    const [shouldRedirect, setRedirect] = React.useState(false);

    React.useEffect(() => {
        storage.customerInfo.clearValue();
        storage.userInfo.clearValue();
        storage.token.clearValue();
        socketService.sendMessage('logout');
        socketService.setReconnect(false);
        setRedirect(true);
    }, []);

    return (
        <Grid container className={classes.root}>
            <Container>
                <div className="row justify-content-center">
                    <div className="col-xl-6">
                        <div className="dashboard-box">
                            <div className="content with-padding">
                                <Loading />
                                {shouldRedirect && <Redirect to={ROUTES.AUTH.LOGIN} />}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Grid>
    );
};
Logout.displayName = 'Logout';
export default Logout;
