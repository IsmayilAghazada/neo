import { storage } from 'app/deps';
import * as React from 'react';
import { Route, useHistory } from 'react-router-dom';

import { ROUTES } from './consts';
import { ProtectedRoute } from './ProtectedRoute';

const Bookmarks = React.lazy(() => import('app/components/Bookmarks'));
export const BookmarksRoute: React.FC = () => {
    const {
        location: { pathname },
    } = useHistory();
    return (
        <ProtectedRoute
            condition={() => Boolean(storage.token.getValue())}
            fallbackPath={ROUTES.AUTH.LOGIN}
            component={Bookmarks}
            path={pathname}
            exact
        />
    );
};
export const BookmarksRoutes = <Route component={BookmarksRoute} path={ROUTES.BOOKMARKS.PATH} exact />;
