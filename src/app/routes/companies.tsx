import * as React from 'react';
import { Route } from 'react-router-dom';

import { ROUTES } from './consts';

const Companies = React.lazy(() => import('app/components/Companies'));
export const CompaniesRoutes = <Route component={Companies} path={ROUTES.COMPANIES.PATH} exact />;
