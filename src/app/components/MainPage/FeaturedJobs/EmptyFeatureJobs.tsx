import * as React from 'react';
import { Box, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
    subRoot: {
        flexGrow: 1,
        backgroundColor: '#fff',
        margin: 0,
        display: 'flex',
        justifyContent: 'center',
    },
    paper: {
        border: 'none',
        boxShadow: 'none',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: '30px 35px',
        color: '#2a41e8',
        flex: '0 0 100%',
        borderLeft: '3px solid transparent',
    },
}));

export const EmptyFeatureJobs: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation('Common');

    return (
        <Paper className={classes.paper}>
            <Grid alignItems="center" container className={classes.subRoot} spacing={4}>
                <Typography component="div" variant="h6">
                    <Box component="span" className="underline" color="#333">
                        {t('noData')}
                    </Box>
                </Typography>
            </Grid>
        </Paper>
    );
};
