import * as React from 'react';
import {
    createStyles,
    Theme,
    makeStyles,
    Paper,
    Container,
    Box,
    Typography,
    useTheme,
    // List,
    // ListItem,
    // ListItemText,
    // Grid,
    // Divider,
    // useMediaQuery,
} from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';
import { HeaderSearch } from './HeaderSearch';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paperContainer: {
            width: '100%',
            padding: '105px 0',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '100% 60%',
            backgroundImage: `linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(2,0,36,0.26234243697478987) 100%)`,
            boxShadow: 'none',
            [theme.breakpoints.up('md')]: {
                backgroundImage: `url('./assets/images/main/background.jpg')`,
            },
        },
        header: {
            maxWidth: 649,
            marginBottom: 44,
        },
        listPrimaryItemText: {
            color: 'rgb(51, 51, 51)',
            margin: 8,
            fontSize: '1.7rem',
            fontWeight: 700,
        },
        listSecItemText: {
            fontSize: '1.1rem',
        },
        divedir: {
            height: 68,
            alignSelf: 'center',
        },
        flexGrid: { display: 'flex', padding: '0px!important' },
    }),
);

export const Header: React.FC = () => {
    const classes = useStyles();
    const theme = useTheme();
    const { t } = useTranslation(['Home']);
    // const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    return (
        <>
            <Paper className={classes.paperContainer}>
                <Container maxWidth="lg">
                    <Typography component="div" className={classes.header}>
                        <Box color="#333" fontSize="1.7rem" fontWeight="fontWeightBold" mb={1} mt={1}>
                            {t('Header.title')}
                        </Box>
                        <Box color="#777" fontSize="1.6rem">
                            <Trans
                                ns="Home"
                                i18nKey="Header.subTitle"
                                components={[
                                    <Box
                                        color={theme.palette.secondary.main}
                                        style={{ display: 'inline' }}
                                        fontSize="1.7rem"
                                        fontWeight="fontWeightBold"
                                        mt={1}
                                        mb={1}
                                    />,
                                ]}
                            />
                        </Box>
                    </Typography>
                    <HeaderSearch />
                    {/* 
                    TODO: temporarily commented
                     */}
                    {/* {isDesktop && (
                        <List style={{ marginTop: 8 }}>
                            <Grid item xs={12}>
                                <Grid container justify="flex-start" spacing={2}>
                                    <Grid item>
                                        <ListItem>
                                            <ListItemText
                                                classes={{
                                                    primary: classes.listPrimaryItemText,
                                                    secondary: classes.listSecItemText,
                                                }}
                                                primary="1,586"
                                                secondary="Jobs Posted"
                                            />
                                        </ListItem>
                                    </Grid>
                                    <Grid classes={{ root: classes.flexGrid }} alignItems="center" item>
                                        <Divider
                                            classes={{ root: classes.divedir }}
                                            variant="middle"
                                            orientation="vertical"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <ListItem>
                                            <ListItemText
                                                classes={{
                                                    primary: classes.listPrimaryItemText,
                                                    secondary: classes.listSecItemText,
                                                }}
                                                primary="1,586"
                                                secondary="Tasks Posted"
                                            />
                                        </ListItem>
                                    </Grid>
                                    <Grid classes={{ root: classes.flexGrid }} alignItems="center" item>
                                        <Divider
                                            classes={{ root: classes.divedir }}
                                            variant="middle"
                                            orientation="vertical"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <ListItem>
                                            <ListItemText
                                                classes={{
                                                    primary: classes.listPrimaryItemText,
                                                    secondary: classes.listSecItemText,
                                                }}
                                                primary="1,586"
                                                secondary="Freelancers"
                                            />
                                        </ListItem>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </List>
                    )} */}
                </Container>
            </Paper>
        </>
    );
};
