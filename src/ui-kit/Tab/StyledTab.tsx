// import * as React from 'react';
import { Tab, withStyles } from '@material-ui/core';

export const StyledTab = withStyles((theme) => ({
    root: {
        '&:hover': {
            color: '#333',
        },
        '&$selected': {
            color: theme.palette.primary.main,
        },
        selected: {},
    },
}))(Tab);
