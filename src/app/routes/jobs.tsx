import * as React from 'react';
import { Route } from 'react-router-dom';

import { ROUTES } from './consts';

const Jobs = React.lazy(() => import('../components/Jobs'));
export const JobsListRoutes = <Route component={Jobs} path={ROUTES.JOBS.PATH} exact />;
