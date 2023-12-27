import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Loading } from 'ui-kit/Loading';

import { ROUTES } from './consts';

const AuthPage = React.lazy(() => import('app/components/Auth/AuthPage'));
const LogoutPage = React.lazy(() => import('app/components/Auth/Logout'));
export const AuthRoutes = (
    <Switch>
        <React.Suspense fallback={<Loading />}>
            <Route component={AuthPage} path={ROUTES.AUTH.LOGIN} exact />
            <Route component={LogoutPage} path={ROUTES.AUTH.LOGOUT} exact />
            <Route component={AuthPage} path={ROUTES.AUTH.REGISTER} exact />
            <Route component={AuthPage} path={ROUTES.AUTH.FORGOT_PASSWORD} exact />
        </React.Suspense>
    </Switch>
);
