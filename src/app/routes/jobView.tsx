import * as React from 'react';
import { Route } from 'react-router-dom';

import { ROUTES } from './consts';

const JobDetails = React.lazy(() => import('../components/JobDetails'));
export const JobsViewRoutes = <Route component={JobDetails} path={ROUTES.VIEW_JOB.PATH} exact />;
