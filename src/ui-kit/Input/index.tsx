import * as React from 'react';
import { makeStyles, InputBaseProps, InputBase } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        height: 48,
        padding: '0 8px 0 16px',
        outline: 'none',
        fontSize: '16px',
        color: '#808080',
        margin: '0',
        maxWidth: '100%',
        width: '100%',
        backgroundColor: '#fff',
        fontWeight: 500,
        borderRadius: 4,
        border: 'none',
        boxShadow: '0 0px 1px 1px rgb(0 0 0 / 12%)',
    },
    focused: {
        boxShadow: '0 0 1px 1px #7b87e2',
        '& $icon': { color: '#2a41e8' },
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #e0e0e0',
        height: '100%',
        width: 48,
        justifyContent: 'center',
        background: '#f8f8f8',
        marginRight: 20,
        color: '#a0a0a0',
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
}));

export const Input = ({
    startAdornment,
    withoutBorder = false,
    value,
    ...restProps
}: InputBaseProps & { withoutBorder?: boolean }): JSX.Element => {
    const { focused, root, icon } = useStyles();
    if (startAdornment && !withoutBorder) {
        return (
            <InputBase
                {...restProps}
                value={value ?? ''}
                classes={{ focused, root }}
                style={{ padding: 0 }}
                startAdornment={<div className={icon}>{startAdornment}</div>}
            />
        );
    }

    return <InputBase {...restProps} value={value ?? ''} startAdornment={startAdornment} classes={{ root, focused }} />;
};
