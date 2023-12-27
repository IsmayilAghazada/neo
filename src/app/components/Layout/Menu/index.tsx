/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { List, makeStyles, createStyles, Theme, Popover } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDependencies } from 'app/hooks';
import { ERole } from 'enums';
import { useTranslation } from 'react-i18next';
import { MENUS } from './const';
import { MenuItem } from './MenuItem';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
        popover: {
            pointerEvents: 'none',
            marginTop: theme.spacing(2),
        },
        paper: {
            color: '#fff',
            backgroundColor: '#303030',
            pointerEvents: 'auto',
            marginTop: '-12px',
            padding: theme.spacing(1),
            overflow: 'visible',
            '&:before': {
                /* tricky doubly-quoted empty string so mui parses it as truly empty */
                content: '""',
                display: 'block',
                width: '0',
                height: '0',
                position: 'absolute',
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                /* border color should probably match whatever your tooltip color is */
                borderBottom: '10px solid #303030',
                left: 16,
                top: '-9px',
            },
        },
        sectionDesktop: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'flex',
            },
        },
        list: {
            width: 'auto',
            display: 'flex',
            flexDirection: 'row',
            marginLeft: 12,
        },
    }),
);

export const Menu: React.FC = () => {
    const { t } = useTranslation('Common');
    const {
        location: { pathname },
    } = useHistory();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<{ to: string; elem: any }[]>(
        MENUS.reduce((acc, { to, subRoutes }) => {
            if (subRoutes) {
                return [...acc, { to, elem: null }];
            }
            return acc;
        }, []),
    );
    const { storage } = useDependencies();

    const handlePopoverOpen = (event: React.MouseEvent, to: string) => {
        const elem = event.currentTarget;
        setAnchorEl((x) => {
            const transformedAnchor = x.map((y) => {
                if (y.to === to) {
                    return { to, elem };
                }
                return { to: y.to, elem: null };
            });
            return transformedAnchor;
        });
    };

    const handlePopoverClose = () => {
        setAnchorEl((x) => {
            const transformedAnchor = x.map((y) => {
                return { to: y.to, elem: null };
            });
            return transformedAnchor;
        });
    };
    const isOpen = (to: string) => Boolean(anchorEl.filter((e) => e.to === to)?.[0]?.elem);
    const isEmployee = (to: string) =>
        storage.userInfo.getValue()?.data?.role === ERole.JOBSEEKER && to === '/employee';
    return (
        <>
            <div className={classes.sectionDesktop}>
                <List className={classes.list}>
                    {MENUS.map(({ to, name, subRoutes }, index) =>
                        Boolean(subRoutes?.length) ? (
                            <MenuItem
                                key={index + name}
                                to={subRoutes.some((e) => e.to === pathname) ? pathname : subRoutes[0].to}
                                name={t(`Nav.${name}`)}
                                hasSubRoute={!isEmployee(to)}
                                aria-owns={isOpen(to) ? name : undefined}
                                aria-haspopup="true"
                                onMouseEnter={(event) => handlePopoverOpen(event, to)}
                                onMouseLeave={handlePopoverClose}
                            >
                                {!isEmployee(to) && (
                                    <Popover
                                        id={isOpen(to) ? name : undefined}
                                        className={classes.popover}
                                        classes={{
                                            paper: classes.paper,
                                        }}
                                        open={isOpen(to)}
                                        anchorEl={anchorEl.filter((e) => e.to === to)?.[0]?.elem}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        onClose={handlePopoverClose}
                                        disableRestoreFocus
                                    >
                                        {subRoutes.map((route, i) => (
                                            <MenuItem
                                                isCurrentSub
                                                key={route.name + i}
                                                to={route.to}
                                                name={t(`Nav.${route.name}`)}
                                            />
                                        ))}
                                    </Popover>
                                )}
                            </MenuItem>
                        ) : (
                            <MenuItem key={index} to={to} name={t(`Nav.${name}`)} />
                        ),
                    )}
                </List>
            </div>
            <div className={classes.grow} />
        </>
    );
};
Menu.displayName = 'Menu';
