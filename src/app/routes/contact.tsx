import * as React from 'react';
import { Route } from 'react-router-dom';

import { ROUTES } from './consts';

const Contact = React.lazy(() => import('app/components/Contact'));
export const ContactRoutes = <Route component={Contact} path={ROUTES.CONTACT.PATH} exact />;
