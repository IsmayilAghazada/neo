import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme, NoSsr, Fab, Grid } from '@material-ui/core';
import { KeyboardArrowUp } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { ROUTES } from 'app/routes/consts';
import { SnackbarProvider } from 'notistack';
import { useAsyncData, useUser } from 'app/hooks';
import { isLoading, isSuccess, isError } from 'utils';
import { Loading } from 'ui-kit/Loading';
import { IMessage } from 'app/deps/messageBus';
import { IAsyncData } from 'model';
import { IUser } from 'app/deps/userService/model';
import { IJobSeeker } from 'app/models/JobSeeker';
import { IRecruiter } from 'app/models/Recruiter';
import { ERole } from 'enums';
import { JobSeekerService } from 'app/services/JobSeeker';
import { ICompany } from 'app/models/Company';
import { CompanyService } from 'app/services/Company';
import { RecruiterService } from 'app/services/Recruiter';
import Confetti from 'react-confetti';
import { Modal } from 'app/deps/modal/Modal';
import { DependenciesProvider } from '../../deps/DependenciesProvider';
import { analyticsService, buildDependencies, messageBus, socketService, storage } from '../../deps';
import { Header } from './Header';
import { ScrollTop } from './Footer/ScrollTop';
import { Footer } from './Footer';
import { AuthModal } from '../Auth/AuthModal';
import { ReportToTelegram } from './Footer/ReportToTelegram';

const theme = createMuiTheme({
    typography: {
        allVariants: {
            color: '#333',
        },
        button: {
            textTransform: 'none',
        },
    },
    palette: {
        primary: {
            light: '#fff',
            main: '#fff',
            dark: '#fff',
            contrastText: '#000',
        },
        secondary: {
            light: '#2a41e8',
            main: '#2a41e8',
            dark: '#2a41e8',
            contrastText: '#fff',
        },
    },
    overrides: {
        MuiSlider: {
            thumb: {
                color: '#2a41e8',
                height: 16,
                width: 16,
                backgroundColor: '#fff',
                boxShadow:
                    '0 2px 1px rgb(25 11 244 / 47%), 1px 0px 0px rgb(25 11 244 / 47%), 0 0px 0px 1px rgb(25 11 244 / 47%)',
                marginTop: -8,
                marginLeft: -8,
                '&:focus, &:hover, &$active': {
                    boxShadow:
                        '0 2px 1px rgb(25 11 244 / 47%), 1px 0px 0px rgb(25 11 244 / 47%), 0 0px 0px 1px rgb(25 11 244 / 47%)',
                    // Reset on touch devices, it doesn't add specificity
                    '@media (hover: none)': {
                        boxShadow:
                            '0 2px 1px rgb(25 11 244 / 47%), 1px 0px 0px rgb(25 11 244 / 47%), 0 0px 0px 1px rgb(25 11 244 / 47%)',
                    },
                },
            },
            track: {
                color: '#2a41e8',
            },
            rail: {
                color: '#9c9c9c',
            },
        },

        MuiPickersToolbar: {
            toolbarLandscape: {
                backgroundColor: '#2a41e8',
                color: '#fff',
            },
            toolbar: {
                backgroundColor: '#2a41e8',
                color: '#fff',
                '& .MuiPickersToolbarText-toolbarTxt': {
                    color: '#fff',
                },
            },
        },
        MuiPickersToolbarButton: {
            toolbarBtn: {
                color: '#fff',
            },
        },
        MuiPickersYear: {
            yearSelected: {
                backgroundColor: '#fff',
                color: '#2a41e8',
                '&:focus,&:hover': {
                    color: '#2a41e8',
                    backgroundColor: '#fff',
                },
            },
        },
        MuiPickersDay: {
            day: {
                color: '2a41e8',
            },
            daySelected: {
                color: '#fff',
                backgroundColor: '#2a41e8',
                '&:hover': {
                    backgroundColor: '#2a41e8',
                },
            },
            dayDisabled: {
                color: 'rgb(141 131 226 / 32%)',
            },
            current: {
                color: '#2a41e8',
            },
        },
        MuiDialogActions: {
            root: {
                display: 'none',
            },
        },
        MuiPickersModal: {
            dialog: {
                color: '#fff',
            },
        },
    },
});
export const Layout: React.FC = ({ children }) => {
    const {
        location: { pathname },
        push,
    } = useHistory();
    const getWindowSize = () => ({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [data, forceUpdate] = React.useState<any>();
    const [userData, reqUserData] = useUser();
    const [congratShown, setCongatsShown] = React.useState(null);
    const [customerData, reqCustomerData] = useAsyncData<ICompany | IJobSeeker | IRecruiter>();

    React.useEffect(() => {
        analyticsService.init();
        socketService.init();
        const congratsSbscrb = messageBus.subscribe<IMessage<'CONGRAT', boolean>>(({ payload }) => {
            setCongatsShown(payload);
        }, 'CONGRAT');
        return congratsSbscrb;
    }, []);
    React.useEffect(() => {
        analyticsService.sendPageView(pathname);
    }, [pathname]);

    React.useEffect(() => {
        if (storage.token.hasValue()) {
            reqUserData();
        }
        const userSbsR = messageBus.subscribe<IMessage<'UPDATED_USER_DATA', IAsyncData<IUser>>>(({ payload }) => {
            if (payload.data.imageUrl) {
                reqUserData();
            }
        }, 'UPDATED_USER_DATA');

        const forceUpdateSbsR = messageBus.subscribe<IMessage<'FORCE_UPDATE', IAsyncData<IUser>>>(() => {
            forceUpdate({} as any);
        }, 'FORCE_UPDATE');

        const unauthorizedSbsR = messageBus.subscribe<IMessage<'UNAUTHORIZED', IAsyncData<IUser>>>(() => {
            // messageBus.publish({ type: 'AUTH_MODAL_REQ', payload: true });
            push(ROUTES.AUTH.LOGIN);
        }, 'UNAUTHORIZED');

        return () => {
            userSbsR();
            forceUpdateSbsR();
            unauthorizedSbsR();
        };
    }, [data]);

    React.useEffect(() => {
        if (isSuccess(userData)) {
            analyticsService.setUserId(`${userData.data.id}`);
            if (userData.data.role === ERole.JOBSEEKER) {
                reqCustomerData(() =>
                    JobSeekerService.getByUserId(userData.data.id).then((res) => {
                        storage.customerInfo.setValue(res);
                        return res;
                    }),
                );
            } else if (userData.data.role === ERole.COMPANY) {
                reqCustomerData(() =>
                    CompanyService.getByUserId(userData.data.id).then((res) => {
                        storage.customerInfo.setValue(res);
                        return res;
                    }),
                );
            } else {
                reqCustomerData(() =>
                    RecruiterService.getByUserId(userData.data.id).then((res) => {
                        storage.customerInfo.setValue(res);
                        return res;
                    }),
                );
            }
        } else if (isError(userData)) {
            storage.token.clearValue();
            storage.customerInfo.clearValue();
            storage.userInfo.clearValue();
            push(ROUTES.AUTH.LOGIN);
        }
    }, [userData]);

    const getContent = () => {
        let content;
        if (storage.token.hasValue()) {
            if (isSuccess(userData) && isSuccess(customerData)) {
                content = (
                    <>
                        <Header />
                        <Grid container style={{ flex: 1 }}>
                            {children}
                        </Grid>
                    </>
                );
            } else if (isLoading(userData) || isLoading(customerData)) {
                content = <Loading />;
            } else {
                content = (
                    <>
                        <Header />
                        <Grid container style={{ flex: 1 }}>
                            {children}
                        </Grid>
                    </>
                );
            }
        } else {
            content = (
                <>
                    <Header />
                    <Grid container style={{ flex: 1 }}>
                        {children}
                    </Grid>
                </>
            );
        }
        return content;
    };

    return (
        <DependenciesProvider dependencies={{ ...buildDependencies(), forceUpdate }}>
            <ThemeProvider theme={theme}>
                <NoSsr>
                    <SnackbarProvider maxSnack={3}>
                        <CssBaseline />
                        <Modal />
                        <Confetti
                            opacity={congratShown === null ? 0 : 1}
                            recycle={congratShown}
                            width={getWindowSize().width - 20}
                            height={getWindowSize().height - 20}
                        />
                        {getContent()}
                        {[
                            '/',
                            ROUTES.HOME.PATH,
                            ROUTES.ABOUT,
                            ROUTES.PRIVACY_POLICE,
                            ROUTES.POST_JOB.PATH,
                            ROUTES.MANAGE_JOBS.PATH,
                            ROUTES.CONTACT.PATH,
                            ROUTES.AUTH.LOGIN,
                            ROUTES.AUTH.REGISTER,
                            ROUTES.AUTH.FORGOT_PASSWORD,
                            ROUTES.AUTH.CONFIRM_ACCOUNT,
                            ROUTES.AUTH.RESET_PASSWORD,
                        ].includes(pathname) && <Footer />}
                        <ScrollTop>
                            <Fab color="secondary" size="small" aria-label="scroll back to top">
                                <KeyboardArrowUp />
                            </Fab>
                        </ScrollTop>
                        <ReportToTelegram />
                    </SnackbarProvider>
                    <AuthModal />
                </NoSsr>
            </ThemeProvider>
        </DependenciesProvider>
    );
};
