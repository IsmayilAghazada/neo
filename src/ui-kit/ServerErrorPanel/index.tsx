import { Box, createStyles, makeStyles, Typography } from '@material-ui/core';
import * as React from 'react';

const useStyles = makeStyles((theme) =>
    createStyles({
        errorWrapper: {
            width: '100%',
            marginTop: '100px',
            marginBottom: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            // [theme.breakpoints.down('md')]: {
            //     marginTop: 0,
            // },
        },
        img: {
            [theme.breakpoints.down('md')]: {
                width: '100%',
                height: 'auto',
            },
        },
    }),
);

interface IProps {
    code?: string | number;
    text?: string;
}

export const ServerErrorPanel: React.FC<IProps> = ({ code = 500, text = 'Internal Server Error' }) => {
    const classes = useStyles();
    return (
        <div className={classes.errorWrapper}>
            <img className={classes.img} src="/assets/images/serverError.svg" alt="" />
            <br />
            <Typography variant="h4" gutterBottom component="div">
                <Box fontWeight="fontWeightMedium"> {code} </Box>
            </Typography>
            <Typography variant="h6" component="div">
                {text}
            </Typography>
        </div>
    );
};
