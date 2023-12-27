import { FormLabel, withStyles } from '@material-ui/core';

export const StyledFormLabel = withStyles(() => ({
    root: {
        fontSize: '1.1rem',
        marginBottom: 20,
    },

    focused: {
        color: '#333 !important',
    },
}))(FormLabel);
