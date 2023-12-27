/* eslint-disable import/no-unresolved */
import * as React from 'react';
import {
    MenuItem as MiuMenuItem,
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList,
    ListItemText,
    CircularProgress,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { IPaginatedData } from 'model';
import { useAsyncData, useDependencies } from 'app/hooks';
import { INotification } from 'app/models/Notification';
import { isSuccess, isLoading } from 'utils';
import { NotificationService } from 'app/services/Notification';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NotificationReadIcon } from './icons/NotificationReadIcon';
import { NotificationItem } from './NotificationItem';

const useStyles = makeStyles(() =>
    createStyles({
        popper: { zIndex: 16, width: 340 },
        listItemTxt: {},
        menuItem: {
            paddingLeft: 20,
            borderLeft: '4px solid transparent',
            '&:hover': {
                borderLeft: '4px solid #2A41E8',
                backgroundColor: '#F0F2FD',
                color: '#2A41E8',
                '& $listItemTxt span': {
                    color: '#2A41E8',
                },
                '& .dropdown-icon path': {
                    stroke: '#2A41E8',
                    strokeOpacity: 1,
                },
            },
        },
        header: {
            borderBottom: '2px solid #E0E0E0',
            padding: '20px 24px',
            marginBottom: 8,
            display: 'flex',
            justifyContent: 'space-between',
            cursor: 'default',
            '&:hover': {
                backgroundColor: '#fff',
            },
        },
        notificationDot: {
            top: 5,
            right: 6,
            backgroundColor: '#FF6359',
        },
        loading: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
        emptyNotification: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            background: 'url(/assets/images/ghost.svg) no-repeat',
            height: '100%',
            backgroundPosition: '50% 50%',
            backgroundSize: '130px',
        },
    }),
);
interface IProps {
    onClose: () => void;
    anchorEl: null | HTMLElement;
    setNotificationBadge: (badgeShown: boolean) => void;
}
export const NotificationPopper: React.FC<IProps> = ({ onClose, anchorEl, setNotificationBadge }) => {
    const classes = useStyles();
    const { messageBus } = useDependencies();
    const isMenuOpen = Boolean(anchorEl);
    const handleListKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            onClose();
        }
    };
    const [notifications, setNotifications] = React.useState([]);
    const [list, setList] = useAsyncData<IPaginatedData<Partial<INotification>>>();
    const [query, setQuery] = React.useState({ skip: 0, take: 10 });
    const onNotificationClick = (id: number, status: 'UNREAD' | 'READ') => {
        if (status === 'UNREAD') {
            setNotifications((items: any) => {
                return items.map((x: INotification) => {
                    if (x.id === id) {
                        return { ...x, status: 'READ' };
                    }
                    return x;
                });
            });
            NotificationService.setStatusRead(id).then();
        }
        onClose();
    };

    React.useEffect(() => {
        messageBus.subscribe(({ payload }) => {
            setNotifications((x) => [payload, ...x]);
        }, 'NOTIFICATION');
    }, []);

    React.useEffect(() => {
        setList(() => NotificationService.getListAll(query));
    }, [query]);

    React.useEffect(() => {
        if (isSuccess(list)) {
            setNotifications((x) => [...x, ...list.data.list]);
        }
    }, [list]);

    React.useEffect(() => {
        setNotificationBadge(!notifications.every((x) => x.status === 'READ'));
    }, [notifications]);

    return (
        <Popper
            className={classes.popper}
            open={isMenuOpen}
            anchorEl={anchorEl}
            role={undefined}
            transition
            disablePortal
        >
            {({ TransitionProps, placement }) => (
                <Grow
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'left top' : 'left bottom' }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={onClose}>
                            <MenuList autoFocusItem={isMenuOpen} id="notification-popper" onKeyDown={handleListKeyDown}>
                                <MiuMenuItem className={`${classes.header}`}>
                                    <ListItemText
                                        className={classes.listItemTxt}
                                        primary="Notifications"
                                        secondary=""
                                    />

                                    <NotificationReadIcon />
                                </MiuMenuItem>
                                <InfiniteScroll
                                    dataLength={notifications.length}
                                    next={() => {
                                        setQuery((x) => ({ ...x, skip: x.skip + 1 }));
                                    }}
                                    hasMore
                                    loader={
                                        isLoading(list) && (
                                            <div className={classes.loading}>
                                                <CircularProgress size="1.5rem" color="secondary" />
                                            </div>
                                        )
                                    }
                                    height={400}
                                >
                                    {isSuccess(list) && !notifications.length && (
                                        <div className={classes.emptyNotification} />
                                    )}
                                    {notifications.map((item: INotification, index) => (
                                        <NotificationItem key={index} item={item} onClick={onNotificationClick} />
                                    ))}
                                </InfiniteScroll>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    );
};
