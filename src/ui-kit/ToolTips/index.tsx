import * as React from 'react';
import { makeStyles, Tooltip, TooltipProps } from '@material-ui/core';

const useStyles = (type: 'dark' | 'light') =>
    makeStyles(() => ({
        arrow: {
            color: type === 'dark' ? '#333' : '#fff',
        },
        tooltip: {
            backgroundColor: type === 'dark' ? '#333' : '#fff',
            color: type === 'dark' ? '#fff' : '#333',
            fontWeight: 500,
            fontSize: '14px',
            padding: '6px 12px',
        },
    }));

interface IProps extends TooltipProps {
    type?: 'dark' | 'light';
}

export const CustomTooltip = (props: IProps): JSX.Element => {
    const { type = 'dark' } = props;
    const classes = useStyles(type)();

    return <Tooltip arrow classes={classes} {...props} />;
};
