/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-has-content */
import * as React from 'react';
import { Box, Container, Grid, makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import './index.scss';

const useStyles = makeStyles(() => ({
    grow: {
        flexGrow: 1,
    },
    root: {
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
        margin: 0,
        paddingBottom: 64,
    },
}));
const About: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation(['About']);

    return (
        <Grid container className={classes.root}>
            <Container>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="dashboard-box about-mission">
                            <div className="mission-caption">
                                <Typography component="div" variant="h3">
                                    <Box component="span" className="underline" color="#333">
                                        {t('mission.title')}
                                    </Box>
                                </Typography>
                                <div style={{ marginTop: 24 }}>
                                    <Typography component="div" variant="h6">
                                        <Box color="#333">{t('mission.body')}</Box>
                                    </Typography>
                                </div>
                            </div>
                            <div className="img" />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-12">
                        <div className="dashboard-box about-value">
                            <div className="value-caption">
                                <Typography component="div" variant="h3">
                                    <Box component="span" className="underline" color="#333">
                                        {t('value.title')}
                                    </Box>
                                </Typography>
                                <div style={{ marginTop: 24 }}>
                                    <Typography component="div" variant="h5">
                                        <Box color="#333">{t('value.body.transparent.subtitle')}</Box>
                                    </Typography>
                                    <Typography component="div" variant="body2">
                                        <Box color="#333">{t('value.body.transparent.caption')}</Box>
                                    </Typography>
                                </div>
                                <div style={{ marginTop: 24 }}>
                                    <Typography component="div" variant="h5">
                                        <Box color="#333">{t('value.body.innovative.subtitle')}</Box>
                                    </Typography>
                                    <Typography component="div" variant="body2">
                                        <Box color="#333">{t('value.body.innovative.caption')}</Box>
                                    </Typography>
                                </div>
                                <div style={{ marginTop: 24 }}>
                                    <Typography component="div" variant="h5">
                                        <Box color="#333">{t('value.body.team.subtitle')}</Box>
                                    </Typography>
                                    <Typography component="div" variant="body2">
                                        <Box color="#333">{t('value.body.team.caption')}</Box>
                                    </Typography>
                                </div>
                                <div style={{ marginTop: 24 }}>
                                    <Typography component="div" variant="h5">
                                        <Box color="#333">{t('value.body.tenacity.subtitle')}</Box>
                                    </Typography>
                                    <Typography component="div" variant="body2">
                                        <Box color="#333">{t('value.body.tenacity.caption')}</Box>
                                    </Typography>
                                </div>
                            </div>
                            <div className="img" />
                        </div>
                    </div>
                </div>
            </Container>
        </Grid>
    );
};
About.displayName = 'About';
export default About;
