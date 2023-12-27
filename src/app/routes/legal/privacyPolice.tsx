import * as React from 'react';
import { Route } from 'react-router-dom';

const PrivacyPolice = React.lazy(() => import('app/components/Legal/PrivacyPolice'));
export const PrivacyPoliceRoutes = <Route component={PrivacyPolice} path="/legal/privacy-police" exact />;
