import { makeStyles, TextField, TextFieldProps, withStyles } from '@material-ui/core';
import React from 'react';

export const StyledTextField = withStyles({
    root: {
        outline: 'none',
        fontSize: '16px',
        color: '#808080',
        maxWidth: '100%',
        width: '100%',
        backgroundColor: '#fff',
        padding: 0,
        fontWeight: 500,
        borderRadius: 4,
        border: 'none !important',
        boxShadow: 'none',
        content: 'none',
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none !important',
            },
            '&:hover fieldset': {
                border: 'none !important',
            },
            '&.Mui-focused fieldset': {
                border: 'none !important',
            },
        },
    },
})(TextField);

const useStyles = makeStyles({
    root: {
        outline: 'none',
        fontSize: '16px',
        color: '#808080',
        maxWidth: '100%',
        width: '100%',
        backgroundColor: '#fff',
        fontWeight: 500,
        borderRadius: 4,
        border: 'none',
        boxShadow: '0 0px 1px 1px rgb(0 0 0 / 12%)',
    },
    input: { padding: '0 0 0 16px !important' },
    focused: {
        boxShadow: '0 0 1px 1px #7b87e2',
        '& $icon': { color: '#2a41e8' },
    },
});

export const TextArea = (props: TextFieldProps): JSX.Element => {
    const classes = useStyles();
    const { value, ...rest } = props;
    return (
        <StyledTextField
            {...rest}
            value={value ?? ''}
            variant="outlined"
            InputProps={{
                classes,
            }}
        />
    );
};
