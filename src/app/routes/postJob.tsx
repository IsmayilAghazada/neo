import { storage } from 'app/deps';
import { ERole } from 'enums';
import * as React from 'react';
import { Route, useHistory } from 'react-router-dom';

import { ROUTES } from './consts';
import { ProtectedRoute } from './ProtectedRoute';

const PostJob = React.lazy(() => import('../components/PostJob'));
export const PostJobRoute: React.FC = () => {
    const {
        location: { pathname },
    } = useHistory();
    return (
        <ProtectedRoute
            condition={() =>
                Boolean(storage.userInfo.getValue()?.data) &&
                storage.userInfo.getValue()?.data?.role !== ERole.JOBSEEKER
            }
            fallbackPath={ROUTES.AUTH.LOGIN}
            component={PostJob}
            path={pathname}
            exact
        />
    );
};
export const PostJobRoutes = <Route component={PostJobRoute} path={ROUTES.POST_JOB.PATH} exact />;
