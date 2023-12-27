/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { createStyles, Fab, makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { Settings } from '@material-ui/icons';
import { useDependencies, useScrollTop } from 'app/hooks';

import './index.scss';
import { IMessage } from 'app/deps/messageBus';

const drawerWidth = 360;
const useStyles = makeStyles((theme) =>
    createStyles({
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            [theme.breakpoints.down('xs')]: {
                width: '100%',
            },
        },
        bottomSticky: {
            background: '#fafafa',
            position: 'fixed',
            width: 352,
            bottom: 0,
            padding: '10px 20px',
            zIndex: 2100,
            marginLeft: '-20px',
            [theme.breakpoints.down('xs')]: {
                width: '100%',
                padding: '10px 20px',
            },
        },
        drawerPaperZero: {
            top: 0,
            width: drawerWidth,
            padding: theme.spacing(3),
            backgroundColor: '#fafafa',
            border: 'none',
            boxShadow: 'none',
            [theme.breakpoints.down('xs')]: {
                width: '100%',
            },
        },
        drawerPaper: {
            top: 86,
            width: drawerWidth,
            padding: theme.spacing(3),
            backgroundColor: '#fafafa',
            border: 'none',
            boxShadow: 'none',
            [theme.breakpoints.down('xs')]: {
                top: 56,
                width: '100%',
            },
        },
        drawerTglBtn: {
            position: 'fixed',
            bottom: 12,
            zIndex: 1201,
        },
        drawerTglBtnRight: {
            bottom: 12,
            right: 4,
        },
        drawerTglBtnLeft: {
            left: 4,
        },
        drawerTglBtnRightFull: {
            left: 340,
        },
    }),
);
interface IProps {
    stickyFooter?: React.ReactNode;
}

export const SideBar: React.FC<IProps> = ({ stickyFooter, children }) => {
    const classes = useStyles();
    const scrollY = useScrollTop();
    const theme = useTheme();
    const isDownXS = useMediaQuery(theme.breakpoints.down('xs'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const [open, setOpen] = React.useState(true);
    const { messageBus } = useDependencies();
    const handleDrawerClose = () => {
        messageBus.publish({ type: 'SIDEBAR_DRAWER', payload: true });
    };

    React.useEffect(() => {
        const sidebarSbcr = messageBus.subscribe<IMessage<'SIDEBAR_DRAWER'>>(({ payload }) => {
            setOpen(payload);
        });
        return sidebarSbcr;
    }, []);

    return (
        <>
            {!isDesktop && !open && (
                <Fab
                    className={`${classes.drawerTglBtn} ${
                        open
                            ? isDownXS
                                ? classes.drawerTglBtnRight
                                : classes.drawerTglBtnRightFull
                            : classes.drawerTglBtnLeft
                    }`}
                    onClick={handleDrawerClose}
                    color="secondary"
                    size="small"
                >
                    <Settings />
                </Fab>
            )}

            {open && (
                <Drawer
                    // hidden={!open}
                    id="content-drawer"
                    className={classes.drawer}
                    variant="permanent"
                    anchor="left"
                    classes={{
                        paper: scrollY > 24 ? classes.drawerPaperZero : classes.drawerPaper,
                    }}
                >
                    <div style={{ marginBottom: scrollY > 24 ? 60 : 160 }}>{children}</div>
                    {stickyFooter && <div className={classes.bottomSticky}>{stickyFooter}</div>}
                </Drawer>
            )}
        </>
    );
};
