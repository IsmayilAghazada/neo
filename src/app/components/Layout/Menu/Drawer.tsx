/* eslint-disable no-nested-ternary */
import * as React from 'react';
import {
    SwipeableDrawer,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    makeStyles,
    Collapse,
    Typography,
} from '@material-ui/core';
import { ImageOutlined, ExpandLess, ExpandMore } from '@material-ui/icons';
import { useDependencies } from 'app/hooks';
import { isSuccess } from 'utils';
import { BACKEND_BASE_URL } from 'consts';
import { IMessage } from 'app/deps/messageBus';
import { useHistory } from 'react-router-dom';
import { ROUTES } from 'app/routes/consts';
import { useTranslation } from 'react-i18next';
import { ERole } from 'enums';
import { MENUS } from './const';
import { MenuItem } from './MenuItem';

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

const useStyles = makeStyles({
    grow: {
        flexGrow: 1,
    },
    headerText: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        marginLeft: 8,
    },
    list: {
        width: 360,
    },
    secondaryText: { color: '#666' },
    activeText: { color: '#2a41e8' },
});

export const Drawer: React.FC<IProps> = ({ isOpen, onClose, onOpen }) => {
    const classes = useStyles();
    const { t } = useTranslation('Common');
    const { storage, forceUpdate, messageBus } = useDependencies();
    const [userData, setUserData] = React.useState(storage.userInfo.getValue());
    const [open, setOpen] = React.useState<{ [key: string]: boolean }>(
        MENUS.reduce((acc, { to, subRoutes }) => {
            if (subRoutes) {
                return { ...acc, [to]: false };
            }
            return acc;
        }, {}),
    );
    const {
        location: { pathname },
        push,
    } = useHistory();

    React.useEffect(() => {
        const userSbsR = messageBus.subscribe<IMessage<'GET_USER_SUCCESS'>>(({ payload }) => {
            setUserData(payload);
        }, 'GET_USER_SUCCESS');

        return userSbsR;
    }, []);
    const isEmployee = (to: string) =>
        storage.userInfo.getValue()?.data?.role === ERole.JOBSEEKER && to === '/employee';

    return (
        <SwipeableDrawer anchor="left" open={isOpen} onClose={onClose} onOpen={onOpen}>
            <div className={classes.list} role="presentation" onKeyDown={onClose}>
                <List>
                    {storage.token.hasValue() && (
                        <>
                            <ListItem
                                onClick={() => {
                                    push(ROUTES.PROFILE.PATH);
                                    onClose();
                                }}
                                style={{ flexDirection: 'column' }}
                            >
                                <ListItemAvatar>
                                    {isSuccess(userData) && Boolean(userData?.data?.imageUrl) ? (
                                        <Avatar
                                            className={classes.avatar}
                                            src={`${BACKEND_BASE_URL}/${userData.data.imageUrl}`}
                                        />
                                    ) : (
                                        <Avatar className={classes.avatar}>
                                            <ImageOutlined />
                                        </Avatar>
                                    )}
                                </ListItemAvatar>
                                <ListItemText
                                    className={classes.headerText}
                                    primary={`${userData?.data?.email}`}
                                    secondary="view"
                                />
                            </ListItem>
                            <Divider orientation="horizontal" />
                        </>
                    )}
                    {MENUS.map(({ to, name, subRoutes }, index) =>
                        subRoutes?.length ? (
                            <React.Fragment key={index}>
                                {isEmployee(to) ? (
                                    <MenuItem
                                        onClick={onClose}
                                        key={index}
                                        to={subRoutes[0].to}
                                        name={t(`Common:Nav.${name}`)}
                                    />
                                ) : (
                                    <>
                                        <ListItem onClick={() => setOpen((x) => ({ ...x, [to]: !x[to] }))} key={name}>
                                            <Typography
                                                component="span"
                                                classes={
                                                    subRoutes.some((e) => e.to === pathname)
                                                        ? { root: classes.activeText }
                                                        : { root: classes.secondaryText }
                                                }
                                                color="primary"
                                            >
                                                {t(`Common:Nav.${name}`)}
                                            </Typography>
                                            <div className={classes.grow} />
                                            {open[to] ? <ExpandLess /> : <ExpandMore />}
                                        </ListItem>
                                        <Collapse in={open[to]} timeout="auto" unmountOnExit>
                                            {subRoutes.map((route) => (
                                                <MenuItem
                                                    isCurrentSub
                                                    fromDrawer
                                                    key={route.name}
                                                    to={route.to}
                                                    name={t(`Common:Nav.${route.name}`)}
                                                    onClick={onClose}
                                                />
                                            ))}
                                        </Collapse>
                                    </>
                                )}
                            </React.Fragment>
                        ) : (
                            <MenuItem onClick={onClose} key={index} to={to} name={t(`Common:Nav.${name}`)} />
                        ),
                    )}
                    <MenuItem onClick={onClose} to={ROUTES.BOOKMARKS.PATH} name={t(`Common:Nav.bookmarks`)} />
                    {storage.token.hasValue() && (
                        <MenuItem
                            onClick={() => {
                                onClose();
                                forceUpdate({} as any);
                            }}
                            to="/logout"
                            name={t('Common:Menu.profile.items.logout')}
                        />
                    )}
                </List>
            </div>
        </SwipeableDrawer>
    );
};
Drawer.displayName = 'Drawer';
