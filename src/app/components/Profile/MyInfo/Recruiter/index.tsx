import * as React from 'react';
import { IAsyncData } from 'model';
import { useDependencies } from 'app/hooks';
import { IMessage } from 'app/deps/messageBus';
import { ROUTES } from 'app/routes/consts';
import { useHistory } from 'react-router-dom';
import { IRecruiter } from 'app/models/Recruiter';
import { RecruiterInfoViewer } from './viewer';
import { RecruiterInfoModal } from './Modal';

export const RecruiterInfo: React.FC<{ data: IAsyncData<IRecruiter> }> = ({ data }) => {
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
            <RecruiterInfoViewer recruiter={data} />
            {pathname === ROUTES.PROFILE.PATH && (
                <RecruiterInfoModal initialData={{ ...data }} opened={opened} onClose={() => setOpen(false)} />
            )}
        </>
    );
};
RecruiterInfo.displayName = 'RecruiterInfo';
