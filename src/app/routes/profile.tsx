import { storage } from 'app/deps';
import * as React from 'react';
import { Route, useHistory } from 'react-router-dom';
// import { Loading } from 'ui-kit/Loading';

import { ROUTES } from './consts';
import { ProtectedRoute } from './ProtectedRoute';

const Profile = React.lazy(() => import('../components/Profile'));

export const ProfileRoute: React.FC = () => {
    const {
        location: { pathname },
    } = useHistory();
    return (
        <ProtectedRoute
            condition={() => Boolean(storage.token.getValue())}
            fallbackPath={ROUTES.AUTH.LOGIN}
            component={Profile}
            path={pathname}
            exact
        />
    );
};

export const ProfileRoutes = <Route exact path={ROUTES.PROFILE.PATH} component={ProfileRoute} />;
