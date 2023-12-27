import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
    MenuItem as MiuMenuItem,
    Avatar,
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ImageOutlined } from '@material-ui/icons';
import { useDependencies } from 'app/hooks';
import { ROUTES } from 'app/routes/consts';
import { useTranslation } from 'react-i18next';
import { BACKEND_BASE_URL } from 'consts';
import { isSuccess } from 'utils';
import { IMessage } from 'app/deps/messageBus';
import { ProgressBar } from 'ui-kit/ProgressBar';
import { ERole } from 'enums';
import { IJobSeeker } from 'app/models/JobSeeker';
import { ICompany } from 'app/models/Company';
import { DropdownIcon } from './icons/DropdownIcon';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        popper: { zIndex: 16, width: 320 },
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
        menuItemPhoto: {
            borderBottom: '2px solid #E0E0E0',
            paddingTop: '24px',
            paddingBottom: '24px',
            borderLeft: '4px solid transparent',
            '&:hover': {
                backgroundColor: 'transparent',
            },
            marginBottom: 8,
            // '&::after': {
            //     borderBottom: '2px solid #E0E0E0',
            // },
        },
        drpwnAvatar: {
            width: theme.spacing(8),
            height: theme.spacing(8),
            // backgroundColor: 'white',
            marginRight: 16,
        },
        completeProfileLink: {
            textDecorationLine: 'underline',
            color: '#ECA400',
            '&:hover': {
                color: '#ECA400',
            },
        },
    }),
);
interface IProps {
    onClose: () => void;
    anchorEl: null | HTMLElement;
}
export const ProfilePopper: React.FC<IProps> = ({ onClose, anchorEl }) => {
    const { t } = useTranslation('Common');
    const classes = useStyles();
    const { messageBus, storage } = useDependencies();
    const { customerInfo, userInfo } = storage;
    const customerData = customerInfo.getValue();
    const [userData, setUserData] = React.useState(userInfo.getValue());
    const { push } = useHistory();
    const isMenuOpen = Boolean(anchorEl);
    const handleListKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            onClose();
        }
    };
    const menuId = 'primary-search-account-menu';
    const getPrimaryName = () => {
        if (isSuccess(userData)) {
            if (userData.data.role === ERole.JOBSEEKER || userData.data.role === ERole.RECRUITER) {
                return `${(customerData as IJobSeeker)?.firstName} ${(customerData as IJobSeeker)?.lastName}`;
            }
            return (customerData as ICompany)?.name;
        }
        return null;
    };

    React.useEffect(() => {
        const userSbsR = messageBus.subscribe<IMessage<'GET_USER_SUCCESS'>>(({ payload }) => {
            setUserData(payload);
        }, 'GET_USER_SUCCESS');

        return userSbsR;
    }, []);

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
                            <MenuList autoFocusItem={isMenuOpen} id={menuId} onKeyDown={handleListKeyDown}>
                                <MiuMenuItem
                                    className={`${classes.menuItemPhoto}`}
                                    onClick={() => {
                                        onClose();
                                        push(ROUTES.PROFILE.PATH);
                                    }}
                                >
                                    <ListItemIcon>
                                        {isSuccess(userData) && Boolean(userData?.data?.imageUrl) ? (
                                            <Avatar
                                                className={classes.drpwnAvatar}
                                                src={`${BACKEND_BASE_URL}/${userData.data.imageUrl}`}
                                            />
                                        ) : (
                                            <Avatar className={classes.drpwnAvatar}>
                                                <ImageOutlined fontSize="large" />
                                            </Avatar>
                                        )}

                                        {customerData?.percentageOfProfileCompletion !== null &&
                                            customerData?.percentageOfProfileCompletion !== 100 && (
                                                <ProgressBar
                                                    progress={customerData?.percentageOfProfileCompletion}
                                                    size={64}
                                                    strokeWidthMain={3}
                                                    strokeWidthBg={1}
                                                    circleOneStroke="#F8DDA2"
                                                    circleTwoStroke="#ECA400"
                                                />
                                            )}
                                    </ListItemIcon>

                                    <ListItemText
                                        className={classes.listItemTxt}
                                        primary={getPrimaryName()}
                                        secondary={
                                            customerData?.percentageOfProfileCompletion !== 100 ? (
                                                <Link className={classes.completeProfileLink} to={ROUTES.PROFILE.PATH}>
                                                    {t('Common:Warning.completeAccount')}
                                                </Link>
                                            ) : (
                                                t(`Common:Role.${userData.data.role}`)
                                            )
                                        }
                                    />
                                </MiuMenuItem>
                                <MiuMenuItem
                                    className={classes.menuItem}
                                    onClick={() => {
                                        onClose();
                                        push(ROUTES.PROFILE.PATH);
                                    }}
                                >
                                    <ListItemIcon style={{ minWidth: 36 }}>
                                        <DropdownIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        className={classes.listItemTxt}
                                        primary={t('Common:Menu.profile.label')}
                                    />
                                </MiuMenuItem>
                                <MiuMenuItem
                                    className={classes.menuItem}
                                    onClick={() => {
                                        onClose();
                                        push(ROUTES.BOOKMARKS.PATH);
                                    }}
                                >
                                    <ListItemIcon style={{ minWidth: 36 }}>
                                        <DropdownIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        className={classes.listItemTxt}
                                        primary={t('Common:Menu.profile.items.bookmarks')}
                                    />
                                </MiuMenuItem>
                                <MiuMenuItem
                                    className={classes.menuItem}
                                    onClick={() => {
                                        onClose();
                                        push(ROUTES.AUTH.LOGOUT);
                                    }}
                                >
                                    <ListItemIcon style={{ minWidth: 36 }}>
                                        <DropdownIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        className={classes.listItemTxt}
                                        primary={t('Common:Menu.profile.items.logout')}
                                    />
                                </MiuMenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    );
};
