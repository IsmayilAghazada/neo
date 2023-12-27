import * as React from 'react';
import { makeStyles, CircularProgress, Backdrop } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        zIndex: 101,
        backgroundColor: 'rgb(222 222 222 / 50%)',
    },
    partial: {
        position: 'relative',
        width: '100%',
        height: '100%',
        zIndex: 0,
    },
    backdrop: {
        position: 'absolute',
        backgroundColor: 'rgb(236 236 236 / 50%) !important',
    },
}));
interface IProps {
    visible?: boolean;
    fullPage?: boolean;
}
export const Loading: React.FC<IProps> = ({ visible = true, fullPage = true, children }) => {
    const classes = useStyles();

    return fullPage ? (
        <Backdrop className={classes.root} open={visible}>
            <CircularProgress color="secondary" />
        </Backdrop>
    ) : (
        <div className={classes.partial}>
            {children}
            <Backdrop open={visible} className={`${classes.root} ${classes.backdrop}`}>
                <CircularProgress color="secondary" />
            </Backdrop>
        </div>
    );
};
