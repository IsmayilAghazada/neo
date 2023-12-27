/* eslint-disable @typescript-eslint/ban-types */
import { makeStyles } from '@material-ui/core';

export const useBtnStyles = makeStyles(() => ({
    root: {
        boxShadow: 'none',
        padding: 12,
        minWidth: 120,
        textTransform: 'none',

        '&:hover': { boxShadow: 'none' },
    },
}));

export const useCoreBtnStyles = makeStyles(() => ({
    root: {
        boxShadow: 'none',
        padding: 12,
        textTransform: 'none',

        '&:hover': { boxShadow: 'none' },
    },
}));
