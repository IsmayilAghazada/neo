import * as React from 'react';

import './index.scss';
import { Container, Grid, makeStyles } from '@material-ui/core';
import { Loading } from 'ui-kit/Loading';
import { useParams } from 'react-router-dom';
import { useAsyncData, useDependencies } from 'app/hooks';
import { IUser } from 'app/deps/userService/model';
import { isLoading, isSuccess } from 'utils';
import { ERole } from 'enums';
import { IJobSeeker } from 'app/models/JobSeeker';
import { IRecruiter } from 'app/models/Recruiter';
import { JobSeekerService } from 'app/services/JobSeeker';
import { ICompany } from 'app/models/Company';
import { CompanyService } from 'app/services/Company';
import { RecruiterService } from 'app/services/Recruiter';
import { useTranslation } from 'react-i18next';
import { ContactInfo } from './Contact';
import { MyInfo } from './MyInfo';
import { Security } from './Security';
import { Experience } from './Experience';
import { Portfolio } from './Portfolio';
import { ProfileContext } from './ProfileContext';
import { Education } from './Education';

const useStyles = makeStyles(() => ({
    grow: {
        flexGrow: 1,
    },
    root: {
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
        margin: 0,
        paddingBottom: 64,
    },
}));

const Profile: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation(['Profile', 'Common']);
    const {
        userService,
        storage: { userInfo, customerInfo },
    } = useDependencies();
    const [userData, setUserData] = useAsyncData<IUser>();
    const [clientData, setClientData] = useAsyncData<IJobSeeker | ICompany | IRecruiter>();
    const { id } = useParams<{ id: string }>();

    React.useEffect(() => {
        if (id !== null && id !== undefined) {
            setUserData(() => userService.getUserById(id));
        } else {
            setUserData(() => Promise.resolve(userInfo.getValue().data));
        }
    }, []);

    React.useEffect(() => {
        if (isSuccess(userData)) {
            if (id !== null && id !== undefined) {
                if (userData.data.role === ERole.JOBSEEKER) {
                    setClientData(() => JobSeekerService.getByUserId(id));
                } else if (userData.data.role === ERole.COMPANY) {
                    setClientData(() => CompanyService.getByUserId(id));
                } else {
                    setClientData(() => RecruiterService.getByUserId(id));
                }
            } else {
                setClientData(() => Promise.resolve(customerInfo.getValue()));
            }
        }
    }, [userData]);

    return (
        <>
            {(isLoading(userData) || isLoading(clientData)) && <Loading />}
            {isSuccess(userData) && isSuccess(clientData) && (
                <ProfileContext.Provider value={{ userData, clientData }}>
                    <Grid container className={classes.root}>
                        <Container>
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="dashboard-box">
                                        <ContactInfo />
                                    </div>
                                </div>

                                <div className="col-xl-12">
                                    <div className="dashboard-box">
                                        <MyInfo />
                                    </div>
                                </div>
                                {userData.data.role === ERole.JOBSEEKER && (
                                    <>
                                        <div className="col-xl-12">
                                            <div className="dashboard-box">
                                                <div className="headline">
                                                    <h3>
                                                        <i className="icon-material-outline-desktop-mac" />{' '}
                                                        {t('titles.education')}
                                                    </h3>
                                                </div>
                                                <div className="content padding-bottom-12">
                                                    <Education />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xl-12">
                                            <div className="dashboard-box">
                                                <div className="headline">
                                                    <h3>
                                                        <i className="icon-material-outline-library-books" />{' '}
                                                        {t('titles.experience')}
                                                    </h3>
                                                </div>
                                                <div className="content padding-bottom-12">
                                                    <Experience />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xl-12">
                                            <div className="dashboard-box">
                                                <div className="headline">
                                                    <h3>
                                                        <i className="icon-material-outline-date-range" />{' '}
                                                        {t('titles.portfolio')}
                                                    </h3>
                                                </div>
                                                <div className="content padding-bottom-12">
                                                    <Portfolio />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {(id === null || id === undefined) && (
                                    <div className="col-xl-12">
                                        <div className="dashboard-box">
                                            <Security />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Container>
                    </Grid>
                </ProfileContext.Provider>
            )}
        </>
    );
};
Profile.displayName = 'Profile';
export default Profile;
