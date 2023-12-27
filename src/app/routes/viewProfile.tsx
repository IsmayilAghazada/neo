import * as React from 'react';
import { Route } from 'react-router-dom';

import { ROUTES } from './consts';

const Profile = React.lazy(() => import('../components/Profile'));
export const ViewProfileRoutes = <Route path={ROUTES.PROFILE.VIEW_OTHER.PATH} exact component={Profile} />;
