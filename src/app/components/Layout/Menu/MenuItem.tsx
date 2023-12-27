import * as React from 'react';
import { MenuItem as MuiMenuItem, Typography, makeStyles, createStyles, Theme } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { ArrowDropDownOutlined } from '@material-ui/icons';

interface IProps {
    to: string;
    name: string;
    hasSubRoute?: boolean;
    onClick?: () => void;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: () => void;
    isCurrentSub?: boolean;
    fromDrawer?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        selectedMenu: {
            backgroundColor: 'transparent',
            color: `${theme.palette.secondary.main}!important`,
            '&:hover': {
                backgroundColor: 'transparent',
                boxShadow: 'none',
            },
        },
        selectedSubMenu: {
            backgroundColor: 'transparent',
            color: `#fff!important`,
            '&:hover': {
                backgroundColor: 'transparent',
                boxShadow: 'none',
            },
        },
        menuItem: {
            color: '#666',
            backgroundColor: 'transparent!important',
            '&:hover': {
                color: theme.palette.secondary.main,
                backgroundColor: 'transparent',
                boxShadow: 'none',
            },
        },
        rootMenuHover: { color: `${theme.palette.secondary.main}!important` },
        subMenu: {
            color: '#aaa',
            '&:hover': {
                color: '#fff',
                backgroundColor: 'transparent',
                boxShadow: 'none',
            },
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
        link: {
            textDecoration: 'none',
            width: 'auto',
        },
    }),
);

export const MenuItem: React.FC<IProps> = ({
    to,
    name,
    hasSubRoute,
    onMouseEnter,
    onMouseLeave,
    children,
    isCurrentSub,
    onClick,
    fromDrawer,
}) => {
    const classes = useStyles();
    return (
        <MuiMenuItem
            button
            key={name}
            className={`${classes.menuItem} ${isCurrentSub && !fromDrawer && classes.subMenu} ${
                fromDrawer && classes.nested
            }`}
            to={to}
            activeClassName={isCurrentSub && !fromDrawer ? classes.selectedSubMenu : classes.selectedMenu}
            onMouseEnter={hasSubRoute && onMouseEnter}
            onMouseLeave={hasSubRoute && onMouseLeave}
            component={NavLink}
            onClick={onClick}
        >
            <Typography color="inherit">{name}</Typography>
            {hasSubRoute && <ArrowDropDownOutlined />}
            {children}
        </MuiMenuItem>
    );
};
