import * as React from 'react';
import { Route } from 'react-router-dom';

import { ROUTES } from './consts';

const ConfirmAccount = React.lazy(() => import('app/components/ConfirmAccount'));
export const ConfirmAccountRoutes = <Route component={ConfirmAccount} path={ROUTES.AUTH.CONFIRM_ACCOUNT} exact />;
