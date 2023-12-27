import * as React from 'react';
import { Grid, makeStyles, Paper, Container, GridListTile, Box, Typography } from '@material-ui/core';
import { BusinessCenterOutlined } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: '#fff',
        margin: 0,
        paddingBottom: 40,
    },
    paper: {
        border: 'none',
        boxShadow: 'none',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 25,
        transition: '0.35s',
        color: '#2a41e8',
        [theme.breakpoints.down('lg')]: {
            flex: '0 0 25%',
        },
        [theme.breakpoints.down('md')]: {
            flex: '0 0 33.3%',
        },
        [theme.breakpoints.down('sm')]: {
            flex: '0 0 50%',
        },
        [theme.breakpoints.down('xs')]: {
            flex: '0 0 100%',
        },
        '&:hover': {
            boxShadow: '0 4px 12px rgba(42,65,232,0.2)',
            backgroundColor: '#2a41e8',
            color: '#fff!important',
            '& $counter': {
                color: '#fff',
                background: 'rgba(0,0,0,0.2)',
            },
            '& $contentHeader': {
                color: '#fff',
            },
            '& $contentText': {
                color: 'rgba(255,255,255,0.7)',
            },
        },
    },
    gridListTile: {
        height: 'auto',
        textAlign: 'center',
        listStyle: 'none',
        width: '100%',
    },
    control: {
        padding: theme.spacing(2),
    },
    contentHeader: { color: '#333', marginBottom: theme.spacing(1) },
    contentText: { color: '#888' },
    counter: {
        display: 'inline-block',
        width: 'auto',
        minWidth: 20,
        height: 24,
        borderRadius: 4,
        padding: '0 8px',
        background: 'rgba(0,0,0,0.06)',
        margin: '0 auto',
        color: '#909090',
        transition: '0.35s',
        marginTop: theme.spacing(2),
        marginBottom: 18,
    },
}));

export const PopularJobs: React.FC = () => {
    const classes = useStyles();
    return (
        <Grid container className={classes.root} spacing={2}>
            <Container>
                <GridListTile cols={2} style={{ margin: '65px 0 32px 0' }} classes={{ root: classes.gridListTile }}>
                    <Box color="#333" fontSize="1.6rem">
                        Popular Job Categories
                    </Box>
                </GridListTile>
                <Grid item xs={12}>
                    <Grid container justify="flex-start" spacing={2}>
                        {Array.from({ length: 8 }, (_, k) => k + 1).map((_, index) => (
                            <Paper key={index} className={classes.paper}>
                                <GridListTile cols={1} classes={{ root: classes.gridListTile }}>
                                    <BusinessCenterOutlined fontSize="large" color="inherit" />
                                </GridListTile>
                                <div className={classes.counter}>
                                    <Box lineHeight={1.8} color="inherit" fontWeight="fontWeightBold">
                                        615
                                    </Box>
                                </div>
                                <div>
                                    <Typography component="div" variant="body1">
                                        <Box
                                            textAlign="center"
                                            className={classes.contentHeader}
                                            fontWeight="fontWeightBold"
                                        >
                                            Data Science & Analitycs
                                        </Box>
                                    </Typography>
                                    <Box textAlign="center" className={classes.contentText} fontWeight="fontWeightBold">
                                        Data Specialist / Scientist, Data Analyst & More
                                    </Box>
                                </div>
                            </Paper>
                        ))}
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    );
};
