import { createStyles, IconButton, makeStyles } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { IMessage } from 'app/deps/messageBus';
import { useAsyncData, useDependencies } from 'app/hooks';
import { ICompany } from 'app/models/Company';
import { IJobSeeker } from 'app/models/JobSeeker';
import { IRecruiter } from 'app/models/Recruiter';
import { ROUTES } from 'app/routes/consts';
import { CompanyService } from 'app/services/Company';
import { JobSeekerService } from 'app/services/JobSeeker';
import { RecruiterService } from 'app/services/Recruiter';
import { ERole } from 'enums';
import { IAsyncData } from 'model';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ProfileContext } from '../ProfileContext';
import { CompanyInfo } from './Company';
import { JobSeekerInfo } from './JobSeeker';
import { RecruiterInfo } from './Recruiter';

const useStyles = makeStyles(() =>
    createStyles({
        header: {
            display: 'flex !important',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '11px 30px  !important',
        },
    }),
);

export const MyInfo: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation(['Profile', 'Common']);
    const { messageBus, storage } = useDependencies();
    const { userData, clientData } = React.useContext(ProfileContext);
    const {
        location: { pathname },
    } = useHistory();
    const [data, setData] = useAsyncData<IJobSeeker | ICompany | IRecruiter>();

    React.useEffect(() => {
        const ssr = messageBus.subscribe<IMessage<'MY_INFO_MODAL', boolean>>(({ payload }) => {
            if (!payload) {
                if (userData.data.role === ERole.JOBSEEKER) {
                    setData(() => JobSeekerService.getByUserId(userData.data.id)).then((res) => {
                        storage.customerInfo.setValue(res);
                    });
                } else if (userData.data.role === ERole.COMPANY) {
                    setData(() => CompanyService.getByUserId(userData.data.id)).then((res) => {
                        storage.customerInfo.setValue(res);
                    });
                } else {
                    setData(() => RecruiterService.getByUserId(userData.data.id)).then((res) => {
                        storage.customerInfo.setValue(res);
                    });
                }
            }
        }, 'MY_INFO_MODAL');

        setData(() => Promise.resolve(clientData.data));

        return ssr;
    }, []);

    return (
        <>
            <div className={`headline ${classes.header}`}>
                <h3>
                    <i className="icon-material-outline-face" /> {t('titles.profileInfo')}
                </h3>

                {pathname === ROUTES.PROFILE.PATH && (
                    <IconButton
                        onClick={() => messageBus.publish({ type: 'MY_INFO_MODAL', payload: true })}
                        color="secondary"
                        aria-label="edit"
                    >
                        <Edit />
                    </IconButton>
                )}
            </div>

            <div className="content with-padding">
                {userData.data.role === ERole.JOBSEEKER && <JobSeekerInfo data={data as IAsyncData<IJobSeeker>} />}
                {userData.data.role === ERole.COMPANY && <CompanyInfo data={data as IAsyncData<ICompany>} />}
                {userData.data.role === ERole.RECRUITER && <RecruiterInfo data={data as IAsyncData<IRecruiter>} />}
            </div>
        </>
    );
};
MyInfo.displayName = 'MyInfo';
