import * as React from 'react';
import { Tabs } from '@material-ui/core';
import { TabPanel } from 'ui-kit/Tab/TabPanel';
import { useDependencies } from 'app/hooks';
import { IMessage } from 'app/deps/messageBus';

import './index.scss';
import { StyledTab } from 'ui-kit/Tab/StyledTab';
import { MuiModal } from 'ui-kit/Modal';
import { LoginPanel } from './LoginPanel';
import { RegistrationPanel } from './RegistrationPanel';
import { ForgotPasswordPanel } from './ForgotPasswordPanel';

export const AuthModal: React.FC = () => {
    const { messageBus } = useDependencies();
    const [open, setOpen] = React.useState(false);
    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (_: React.MouseEvent, newValue: number) => {
        setTabValue(newValue);
    };

    React.useEffect(() => {
        const authModalSbsr = messageBus.subscribe<IMessage<'AUTH_MODAL_REQ', boolean>>(({ payload }) => {
            setOpen(payload);
        }, 'AUTH_MODAL_REQ');
        return authModalSbsr;
    }, []);

    return (
        <MuiModal
            opened={open}
            onClose={() => setOpen(false)}
            header={
                <Tabs
                    variant="scrollable"
                    value={tabValue}
                    indicatorColor="secondary"
                    textColor="secondary"
                    onChange={handleTabChange}
                >
                    <StyledTab label="Log in" />
                    <StyledTab label="Register" />
                </Tabs>
            }
            body={
                <>
                    <TabPanel value={tabValue} index={0}>
                        <LoginPanel setTabValue={setTabValue} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <RegistrationPanel />
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <ForgotPasswordPanel setTabValue={setTabValue} />
                    </TabPanel>
                </>
            }
        />
    );
};
