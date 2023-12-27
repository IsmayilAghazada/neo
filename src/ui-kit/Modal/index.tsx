import * as React from 'react';
import { Modal, IconButton, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';

import './index.scss';

const useStyles = makeStyles((theme) => ({
    modal: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    paper: {
        transform: 'translate(0)',
        width: 316,
        backgroundColor: theme.palette.background.paper,
        border: 0,
        borderRadius: 4,
        boxShadow: theme.shadows[5],
        padding: 0,
        // top: 40,
        // left: `50%`,
        // transform: `translate(-50%, 0)`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
    },
    overlayPaper: {
        borderRadius: 0,
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        transform: 'translate(0)',
        '& $contentWrapper': {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '100%',
        },
        '& $bodyWrapper': {
            marginBottom: 80,
            [theme.breakpoints.down('sm')]: {
                padding: '0 12px',
                paddingTop: 64,
            },
            [theme.breakpoints.up('sm')]: {
                padding: '0 24px',
                paddingTop: 64,
            },
            [theme.breakpoints.up('md')]: {
                padding: '0 120px',
                paddingTop: 64,
            },
        },
        '& $headerWrapper $closeBtnIcon': {
            [theme.breakpoints.down('sm')]: {
                fontSize: '1.5rem',
            },
            [theme.breakpoints.up('sm')]: {
                fontSize: '2.5rem',
            },
            [theme.breakpoints.up('md')]: {
                fontSize: '3rem',
            },
        },
    },
    headerWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerWrapperPadding: {
        [theme.breakpoints.down('sm')]: {
            padding: '0 0 0 12px',
        },
        [theme.breakpoints.up('sm')]: {
            padding: '0 0 0 24px',
        },
        [theme.breakpoints.up('md')]: {
            padding: '0 0 0 120px',
        },
    },
    bodyWrapper: {},
    contentWrapper: { maxHeight: 'calc(100vh - 160px)', overflow: 'auto' },
    xs: { width: 316 },
    sm: {
        [theme.breakpoints.down('sm')]: {
            width: 316,
        },
        [theme.breakpoints.up('sm')]: {
            width: 400,
        },
    },
    md: {
        [theme.breakpoints.down('sm')]: {
            width: 316,
        },
        [theme.breakpoints.up('sm')]: {
            width: 400,
        },
        [theme.breakpoints.up('sm')]: {
            width: 540,
        },
    },
    lg: {
        [theme.breakpoints.down('sm')]: {
            width: 316,
        },
        [theme.breakpoints.up('sm')]: {
            width: 500,
        },
        [theme.breakpoints.up('md')]: {
            width: 800,
        },
    },
    closeBtn: {
        color: theme.palette.grey[500],
        marginLeft: 12,
        marginRight: 12,
    },
    closeBtnIcon: { overflow: 'auto' },
    footer: {
        position: 'relative',
        marginTop: 'auto',
        backgroundColor: '#fff',
        borderTop: '1px solid #e2e3e2',
    },
    footerInner: {
        textAlign: 'right',
    },
    footerSpaces: {
        paddingTop: 16,
        paddingBottom: 24,
        marginRight: 120,
        marginLeft: 120,
    },
}));

export interface IModalProps {
    opened?: boolean;
    onClose?: () => void;
    mode?: 'overlay' | 'centered';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    header?: React.ReactNode | string;
    footer?: React.ReactNode | string;
    body: React.ReactNode;
    divider?: boolean;
    headerPadding?: boolean;
    footerPadding?: boolean;
}

export const MuiModal: React.FC<IModalProps> = ({
    size = 'md',
    mode = 'centered',
    opened = false,
    onClose,
    header,
    body,
    divider = false,
    footer = null,
    headerPadding = false,
    footerPadding = false,
}) => {
    const classes = useStyles();
    const handleClose = () => {
        onClose();
    };

    const getPaperClass = () => {
        if (mode === 'overlay') {
            return `${classes.paper} ${classes.overlayPaper}`;
        }
        if (size === 'xs') {
            return `${classes.paper} ${classes.xs}`;
        }
        if (size === 'sm') {
            return `${classes.paper} ${classes.sm}`;
        }
        if (size === 'md') {
            return `${classes.paper} ${classes.md}`;
        }
        return `${classes.paper} ${classes.lg}`;
    };

    return (
        <Modal className={classes.modal} open={opened} onClose={handleClose}>
            <div className={getPaperClass()}>
                {header && (
                    <div
                        id="mui-custom-modal-header"
                        className={`${classes.headerWrapper} ${headerPadding && classes.headerWrapperPadding}`}
                    >
                        {header}
                        <IconButton aria-label="close" className={classes.closeBtn} onClick={handleClose}>
                            <Close className={classes.closeBtnIcon} />
                        </IconButton>
                    </div>
                )}
                {divider && <Divider />}
                <div className={classes.contentWrapper}>
                    <div className={classes.bodyWrapper}>{body}</div>
                    {Boolean(footer) && (
                        <div className={classes.footer}>
                            <div
                                className={`${classes.footerInner} ${
                                    (mode === 'overlay' || footerPadding) && classes.footerSpaces
                                }`}
                            >
                                {footer}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};
