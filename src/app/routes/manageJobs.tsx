import { storage } from 'app/deps';
import { ERole } from 'enums';
import * as React from 'react';
import { Route, useHistory } from 'react-router-dom';

import { ROUTES } from './consts';
import { ProtectedRoute } from './ProtectedRoute';

const ManageJobs = React.lazy(() => import('../components/ManageJobs'));
export const ManageJobsRoute: React.FC = () => {
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
            component={ManageJobs}
            path={pathname}
            exact
        />
    );
};
export const ManageJobsRoutes = <Route component={ManageJobsRoute} path={ROUTES.MANAGE_JOBS.PATH} exact />;
