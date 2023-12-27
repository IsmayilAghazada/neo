import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { IconButton, Divider, Avatar, Button, useMediaQuery, useTheme, MenuItem, Badge } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { MenuOutlined as MenuIcon, ExitToAppOutlined, ImageOutlined } from '@material-ui/icons';
import { useDependencies } from 'app/hooks';
import { ROUTES } from 'app/routes/consts';
import { useTranslation } from 'react-i18next';
import { BACKEND_BASE_URL } from 'consts';
import { isSuccess } from 'utils';
import { IMessage } from 'app/deps/messageBus';
import { ProgressBar } from 'ui-kit/ProgressBar';
import { Drawer } from '../Drawer';
import { ProfilePopper } from './ProfilePopper';
import { WarningIcon } from './icons/WarningIcon';
import { BellIcon } from './icons/BellIcon';
import { NotificationPopper } from './NotificationPopper';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        sectionMobile: {
            display: 'flex',
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
        button: {
            boxShadow: 'none',
            color: '#666',
            border: 0,
            margin: theme.spacing(1),
            '&:hover': {
                boxShadow: 'none',
                color: theme.palette.secondary.main,
            },
        },
        notificationDot: {
            top: 5,
            right: 6,
            backgroundColor: '#FF6359',
        },
    }),
);

export const RightMenu: React.FC = () => {
    const { t } = useTranslation('Common');
    const classes = useStyles();
    const { messageBus, storage } = useDependencies();
    const { customerInfo, userInfo } = storage;
    const customerData = customerInfo.getValue();
    const [userData, setUserData] = React.useState(userInfo.getValue());
    const { push } = useHistory();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [anchorNotificationEl, setAnchorNotificationEl] = React.useState<null | HTMLElement>(null);
    const [anchorDrawerEl, setAnchorDrawerEl] = React.useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const [notificationBadgeShown, setNotificationBadgeShown] = React.useState(false);

    React.useEffect(() => {
        const userSbsR = messageBus.subscribe<IMessage<'GET_USER_SUCCESS'>>(({ payload }) => {
            setUserData(payload);
        }, 'GET_USER_SUCCESS');

        return userSbsR;
    }, []);

    return (
        <>
            {storage.token.hasValue() ? (
                <>
                    <MenuItem>
                        <IconButton
                            aria-label="show more"
                            aria-controls="notification-popper"
                            aria-haspopup="true"
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                setAnchorNotificationEl(event.currentTarget);
                            }}
                            color="inherit"
                        >
                            <Badge
                                classes={{ badge: classes.notificationDot }}
                                color="error"
                                overlap="circle"
                                badgeContent=" "
                                variant="dot"
                                invisible={!notificationBadgeShown}
                            >
                                <BellIcon />
                            </Badge>
                        </IconButton>
                    </MenuItem>
                    <Divider orientation="vertical" flexItem />
                    <IconButton
                        style={{ marginLeft: isDesktop ? 24 : 0 }}
                        aria-label="show more"
                        aria-controls="profile-popper"
                        aria-haspopup="true"
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            setAnchorEl(event.currentTarget);
                        }}
                        color="inherit"
                    >
                        {isSuccess(userData) && Boolean(userData?.data?.imageUrl) ? (
                            <Avatar src={`${BACKEND_BASE_URL}/${userData.data.imageUrl}`} />
                        ) : (
                            <Avatar>
                                <ImageOutlined />
                            </Avatar>
                        )}
                        {customerData?.percentageOfProfileCompletion !== 100 && (
                            <>
                                <ProgressBar
                                    progress={100}
                                    size={46}
                                    strokeWidthMain={2}
                                    strokeWidthBg={1}
                                    circleOneStroke="#ECA400"
                                    circleTwoStroke="#ECA400"
                                    showText={false}
                                />
                                <WarningIcon />
                            </>
                        )}
                    </IconButton>
                </>
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.button}
                    startIcon={<ExitToAppOutlined />}
                    onClick={() => {
                        // messageBus.publish({ type: 'AUTH_MODAL_REQ', payload: true });
                        push(ROUTES.AUTH.LOGIN);
                    }}
                >
                    {isDesktop && `${t('Common:Action.LOGIN')} / ${t('Common:Action.REGISTER')}`}
                </Button>
            )}
            <div className={classes.sectionMobile}>
                <Divider orientation="vertical" flexItem />
                <IconButton
                    onClick={(event: React.MouseEvent<HTMLElement>) => {
                        setAnchorDrawerEl(event.currentTarget);
                    }}
                    edge="end"
                    color="inherit"
                    aria-label="open drawer"
                >
                    <MenuIcon />
                </IconButton>
            </div>
            <ProfilePopper
                anchorEl={anchorEl}
                onClose={() => {
                    setAnchorEl(null);
                }}
            />
            {storage.token.hasValue() && (
                <NotificationPopper
                    setNotificationBadge={(badgeShown: boolean) => {
                        setNotificationBadgeShown(badgeShown);
                    }}
                    anchorEl={anchorNotificationEl}
                    onClose={() => {
                        setAnchorNotificationEl(null);
                    }}
                />
            )}
            <Drawer
                isOpen={Boolean(anchorDrawerEl)}
                onOpen={(event) => {
                    setAnchorDrawerEl(event.currentTarget);
                }}
                onClose={() => {
                    setAnchorDrawerEl(null);
                }}
            />
        </>
    );
};
