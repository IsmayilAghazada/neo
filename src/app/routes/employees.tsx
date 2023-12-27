import * as React from 'react';
import { Route } from 'react-router-dom';

import { ROUTES } from './consts';

const Employees = React.lazy(() => import('app/components/Employees'));
export const EmployeeRoutes = <Route component={Employees} path={ROUTES.EMPLOYEES.PATH} exact />;
