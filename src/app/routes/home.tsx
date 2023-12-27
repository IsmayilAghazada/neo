import * as React from 'react';
import { Route } from 'react-router-dom';

import { ROUTES } from './consts';

const MainPage = React.lazy(() => import('../components/MainPage'));
export const HomeRoutes = <Route component={MainPage} path={[ROUTES.HOME.PATH, '/']} exact />;
