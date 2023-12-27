/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/anchor-has-content */
import * as React from 'react';
import { Box, Container, Grid, makeStyles, Typography } from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';

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
const PrivacyPolice: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation(['PrivacyPolice']);

    return (
        <Grid container className={classes.root}>
            <Container>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="dashboard-box">
                            <div className="headline">
                                <h3>{t('header')}</h3>
                            </div>
                            <div className="content with-padding">
                                <div className="row">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <strong />,
                                                    <br />,
                                                    <a href="https://doqquz.az" />,
                                                    <strong />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="mainSection"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="subtitle1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="subtitle1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="1"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="subtitle1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="2"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="subtitle1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="3"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="subtitle1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="body1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="body1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="4"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="subtitle1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="5"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="subtitle1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="6"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="subtitle1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="7"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="subtitle1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="8"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="subtitle1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="9"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="subtitle1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="10"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="subtitle1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="11"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="subtitle1"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="12"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="subtitle1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="13"
                                            />
                                        </Box>
                                    </Typography>
                                </div>

                                <div className="row margin-top-12">
                                    <Typography component="div" variant="body1">
                                        <Box color="#333">
                                            <Trans
                                                components={[
                                                    <Typography
                                                        style={{ fontWeight: 'bold' }}
                                                        variant="h6"
                                                        gutterBottom
                                                    />,
                                                    <Typography variant="body1" gutterBottom />,
                                                ]}
                                                ns="PrivacyPolice"
                                                i18nKey="14"
                                            />
                                        </Box>
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Grid>
    );
};
PrivacyPolice.displayName = 'PrivacyPolice';
export default PrivacyPolice;
