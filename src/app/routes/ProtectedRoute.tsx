import * as React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

interface IProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    path: string;
    fallbackPath: string;
    condition: () => boolean;
    exact?: boolean;
}

export const ProtectedRoute: React.FC<IProps> = React.memo(
    ({ component: Component, fallbackPath, condition, ...routeProps }) => {
        return (
            <Route
                {...routeProps}
                render={(props) => {
                    return condition() ? (
                        <Component {...props} />
                    ) : (
                        <Redirect to={{ pathname: fallbackPath, state: { from: props.location } }} />
                    );
                }}
            />
        );
    },
);
ProtectedRoute.displayName = 'ProtectedRoute';
