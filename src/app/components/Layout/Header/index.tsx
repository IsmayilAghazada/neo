import * as React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Divider, useMediaQuery, useTheme } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Menu } from '../Menu';
import { RightMenu } from '../Menu/RightMenu';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        navbar: {
            backgroundColor: '#fff',
            boxShadow: '0 0 18px 0 rgba(0, 0, 0, 0.12)',
        },
        logoImg: {
            paddingRight: theme.spacing(2),
            height: 56,
        },
        logoMobImg: {
            paddingRight: theme.spacing(2),
            height: 40,
        },
        logo: {
            display: 'flex',
        },
    }),
);

export const Header: React.FC = () => {
    const classes = useStyles();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const isMob = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <div>
            <AppBar className={classes.navbar} position="sticky">
                <Toolbar id="back-to-top-anchor">
                    <div className={classes.logo}>
                        <Link to="/home">
                            <img
                                alt=""
                                src={`/assets/images/logo${isMob ? '-mob' : ''}.svg`}
                                className={isMob ? classes.logoMobImg : classes.logoImg}
                            />
                        </Link>
                        {isDesktop && <Divider orientation="vertical" flexItem />}
                    </div>
                    <Menu />
                    <RightMenu />
                </Toolbar>
            </AppBar>
        </div>
    );
};
