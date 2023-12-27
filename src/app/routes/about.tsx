import * as React from 'react';
import { Route } from 'react-router-dom';

const About = React.lazy(() => import('app/components/About/About'));

export const AboutRoutes = <Route component={About} path="/about" exact />;
