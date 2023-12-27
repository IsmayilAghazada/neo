import * as React from 'react';
import { makeStyles, MenuItem, Popover, Button } from '@material-ui/core';
import { ExpandMore, ExpandLess, Check } from '@material-ui/icons';
import { ELanguage } from '../../enums';
import { useLang } from '../../app/hooks';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    popover: {
        marginTop: theme.spacing(2),
    },
    paper: {
        color: '#808080',
        backgroundColor: '#fff',
        pointerEvents: 'auto',
        marginTop: 0,
        padding: theme.spacing(0),
        overflow: 'visible',
        '&:before': {
            /* tricky doubly-quoted empty string so mui parses it as truly empty */
            content: '""',
            display: 'block',
            width: '0',
            height: '0',
            position: 'absolute',
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            /* border color should probably match whatever your tooltip color is */
            borderBottom: '10px solid #fff',
            left: 16,
            top: '-7px',
        },
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        color: '#808080',
        '&:hover': {
            backgroundColor: 'rgba(42,65,232,0.07)',
            color: theme.palette.secondary.main,
        },
    },
    btn: {
        color: '#fff',
        backgroundColor: '#444',
        boxShadow: 'none',
        '&:hover': {
            backgroundColor: theme.palette.secondary.main,
        },
    },
}));

const languageNames: { [key in ELanguage]: string } = {
    [ELanguage.AZ]: 'Azərbaycanca',
    [ELanguage.EN]: 'English',
    [ELanguage.RU]: 'Pусский',
};

export const LanguageSwitcher = (): JSX.Element => {
    const classes = useStyles();
    const { currentLang, setCurrentLang } = useLang();
    const languages = Object.keys(ELanguage).map((langKey) => ELanguage[langKey as keyof typeof ELanguage]);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    return (
        <>
            <Button
                className={classes.btn}
                style={open ? { backgroundColor: '#2a41e8' } : {}}
                aria-owns={open && 'languageSwitcher'}
                aria-haspopup="true"
                aria-describedby={open && 'languageSwitcher'}
                variant="contained"
                color="primary"
                onClick={handlePopoverOpen}
                endIcon={open ? <ExpandLess /> : <ExpandMore />}
            >
                {languageNames[currentLang ?? 'az']}
            </Button>
            <Popover
                id="languageSwitcher"
                className={classes.popover}
                classes={{
                    paper: classes.paper,
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                {languages.map((lang, i) => (
                    <MenuItem
                        className={classes.item}
                        onClick={() => {
                            setCurrentLang(lang);
                            handlePopoverClose();
                        }}
                        key={i}
                    >
                        {languageNames[lang]}
                        {currentLang === lang && <Check fontSize="small" color="secondary" />}
                    </MenuItem>
                ))}
            </Popover>
        </>
    );
};
