import * as React from 'react';
import { IAsyncData } from 'model';
import { useDependencies } from 'app/hooks';
import { IMessage } from 'app/deps/messageBus';
import { ROUTES } from 'app/routes/consts';
import { useHistory } from 'react-router-dom';
import { ICompany } from 'app/models/Company';
import { CompanyInfoModal } from './Modal';
import { CompanyInfoViewer } from './viewer';

export const CompanyInfo: React.FC<{ data: IAsyncData<ICompany> }> = ({ data }) => {
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
            <CompanyInfoViewer company={data} />
            {pathname === ROUTES.PROFILE.PATH && (
                <CompanyInfoModal initialData={{ ...data }} opened={opened} onClose={() => setOpen(false)} />
            )}
        </>
    );
};
CompanyInfo.displayName = 'CompanyInfo';
