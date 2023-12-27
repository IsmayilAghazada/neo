import * as React from 'react';
// import { useTranslation } from 'react-i18next';
import { IAsyncData } from 'model';
import { IJobSeeker } from 'app/models/JobSeeker';
import { useDependencies } from 'app/hooks';
import { IMessage } from 'app/deps/messageBus';
import { ROUTES } from 'app/routes/consts';
import { useHistory } from 'react-router-dom';
import { JobSeekerInfoModal } from './Modal';
import { JobSeekerInfoViewer } from './viewer';

export const JobSeekerInfo: React.FC<{ data: IAsyncData<IJobSeeker> }> = ({ data }) => {
    // const { t } = useTranslation('Common');
    const { messageBus } = useDependencies();
    const [opened, setOpen] = React.useState(false);
    const {
        location: { pathname },
    } = useHistory();

    React.useEffect(() => {
        const sbsr = messageBus.subscribe<IMessage<'MY_INFO_MODAL', boolean>>(({ payload }) => {
            setOpen(payload);
        }, 'MY_INFO_MODAL');
        return sbsr;
    }, []);

    return (
        <>
            <JobSeekerInfoViewer jobSeeker={data} />
            {pathname === ROUTES.PROFILE.PATH && (
                <JobSeekerInfoModal initialData={{ ...data }} opened={opened} onClose={() => setOpen(false)} />
            )}
        </>
    );
};
JobSeekerInfo.displayName = 'JobSeekerInfo';
