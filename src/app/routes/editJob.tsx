import * as React from 'react';
import { Route } from 'react-router-dom';

import { ROUTES } from './consts';

const PostJob = React.lazy(() => import('app/components/PostJob'));

export const EditJobRoutes = <Route component={PostJob} path={ROUTES.EDIT_JOB.PATH} exact />;
