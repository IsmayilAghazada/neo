import * as React from 'react';
import { Route } from 'react-router-dom';

import { ROUTES } from './consts';

const ResetPassword = React.lazy(() => import('../components/ResetPassword'));
export const ResetPasswordRoutes = <Route component={ResetPassword} path={ROUTES.AUTH.RESET_PASSWORD} exact />;
