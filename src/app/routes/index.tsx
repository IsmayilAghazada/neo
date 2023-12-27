import * as React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Loading } from 'ui-kit/Loading';
import { ROUTES } from './consts';
import { Layout } from '../components/Layout';
import { ResetPasswordRoutes } from './resetPassword';
import { ContactRoutes } from './contact';
import { AuthRoutes } from './auth';
import { PrivacyPoliceRoutes } from './legal/privacyPolice';
import { AboutRoutes } from './about';
import { ConfirmAccountRoutes } from './confirmAccount';
import { EditJobRoutes } from './editJob';
import { EmployeeRoutes } from './employees';
import { HomeRoutes } from './home';
import { JobsListRoutes } from './jobs';
import { JobsViewRoutes } from './jobView';
import { ManageJobsRoutes } from './manageJobs';
import { PostJobRoutes } from './postJob';
import { CompaniesRoutes } from './companies';
import { ViewProfileRoutes } from './viewProfile';
import { ProfileRoutes } from './profile';
import { BookmarksRoutes } from './bookmarks';

export const AppRoutes: React.FC = () => {
    return (
        <Router basename="/" keyLength={12}>
            <Switch>
                <Route
                    render={() => (
                        <Layout>
                            <Switch>
                                <React.Suspense fallback={<Loading />}>
                                    {AuthRoutes}
                                    {HomeRoutes}
                                    {JobsListRoutes}
                                    {JobsViewRoutes}
                                    {EmployeeRoutes}
                                    {PostJobRoutes}
                                    {EditJobRoutes}
                                    {ManageJobsRoutes}
                                    {CompaniesRoutes}
                                    {ViewProfileRoutes}
                                    {ResetPasswordRoutes}
                                    {ConfirmAccountRoutes}
                                    {ContactRoutes}
                                    {PrivacyPoliceRoutes}
                                    {ProfileRoutes}
                                    {AboutRoutes}
                                    {BookmarksRoutes}
                                </React.Suspense>
                            </Switch>
                        </Layout>
                    )}
                    path={ROUTES.PATH}
                />
            </Switch>
        </Router>
    );
};
