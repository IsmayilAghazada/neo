import { createStyles, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() =>
    createStyles({
        warningCompletion: {
            position: 'absolute',
            top: 8,
            right: 8,
        },
    }),
);

export const WarningIcon = () => {
    const classes = useStyles();
    return (
        <svg
            className={classes.warningCompletion}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M8 0C3.58198 0 0 3.58198 0 8C0 12.4185 3.58198 16 8 16C12.4185 16 16 12.419 16 8C16 3.58198 12.4185 0 8 0Z"
                fill="#ECA400"
            />
            <path
                d="M8.00066 3.50848C7.42768 3.50848 6.99414 3.8075 6.99414 4.29049V8.72048C6.99414 9.20397 7.42763 9.50198 8.00066 9.50198C8.55966 9.50198 9.00719 9.1915 9.00719 8.72048V4.29049C9.00713 3.81897 8.55966 3.50848 8.00066 3.50848ZM8.00066 10.5C7.45017 10.5 7.00214 10.948 7.00214 11.499C7.00214 12.049 7.45017 12.497 8.00066 12.497C8.55116 12.497 8.99869 12.049 8.99869 11.499C8.99863 10.948 8.55116 10.5 8.00066 10.5Z"
                fill="white"
            />
        </svg>
    );
};
