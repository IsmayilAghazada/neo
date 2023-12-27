import * as React from 'react';

import { IDependencies } from '.';

export interface IDependenciesContext extends IDependencies {
    forceUpdate: React.Dispatch<(prevState: undefined) => undefined>;
}
export const DependenciesContext = React.createContext<IDependenciesContext>({
    messageBus: null as any,
    langService: null as any,
    storage: null as any,
    httpClient: null as any,
    axiosInstance: null as any,
    forceUpdate: null as any,
    userService: null as any,
    history: null as any,
    analyticsService: null as any,
    modalService: null as any,
    socketService: null as any,
});

export const DependenciesProvider: React.FC<{ dependencies: IDependenciesContext }> = React.memo(
    ({ dependencies, children }) => {
        return <DependenciesContext.Provider value={dependencies}>{children}</DependenciesContext.Provider>;
    },
);

export const DependenciesConsumer = DependenciesContext.Consumer;
