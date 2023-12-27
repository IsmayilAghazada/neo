/* eslint-disable no-nested-ternary */
import * as React from 'react';
import {
    makeStyles,
    MenuItem,
    Popover,
    Button,
    FormControl,
    FormGroup,
    useTheme,
    useMediaQuery,
    withStyles,
    FormLabel,
} from '@material-ui/core';
import { ExpandMore, ExpandLess, Check } from '@material-ui/icons';
import { ECurrencyCode } from 'enums';

export const StyldFormLabel = withStyles(() => ({
    root: {
        fontSize: '1.4rem',
        marginBottom: 20,
    },
}))(FormLabel);

const useStyles = makeStyles((theme) => ({
    grow: { flexGrow: 1 },
    popover: { marginTop: 0 },
    formControl: { width: '100%', marginBottom: 32 },
    paper: {
        color: '#808080',
        backgroundColor: '#fff',
        pointerEvents: 'auto',
        marginTop: 0,
        padding: 5,
        maxHeight: 350,
        overflow: 'auto',
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
        height: 42,
        color: '#333',
        textTransform: 'none',
        backgroundColor: '#fff',
        boxShadow: '0 0px 1px 1px rgb(0 0 0 / 12%)',
        '&:hover': {
            backgroundColor: '#fff',
            boxShadow: '0 0px 1px 1px rgb(0 0 0 / 12%)',
        },
        '&:focus': {
            backgroundColor: '#fff',
            boxShadow: '0 0px 1px 1px rgb(0 0 0 / 12%)',
        },
    },
}));
const currencies = Object.keys(ECurrencyCode);
export const Currency = (): JSX.Element => {
    const classes = useStyles();
    const [currency, setCurrency] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const theme = useTheme();
    const isDownXS = useMediaQuery(theme.breakpoints.down('xs'));

    const handlePopoverOpen = (event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    return (
        <FormControl color="secondary" component="fieldset" className={classes.formControl}>
            <StyldFormLabel>Currency</StyldFormLabel>
            <FormGroup aria-label="currency" row>
                <Button
                    fullWidth
                    className={classes.btn}
                    aria-haspopup="true"
                    aria-describedby={open ? 'currency' : undefined}
                    variant="contained"
                    color="primary"
                    onClick={handlePopoverOpen}
                    endIcon={open ? <ExpandLess /> : <ExpandMore />}
                >
                    <div className={classes.grow} style={{ textAlign: 'left' }}>
                        {!currency.length
                            ? 'All Currencies'
                            : currency.length === 1
                            ? currency[0].name
                            : `${currency.length} currencies selected`}
                    </div>
                </Button>
                <Popover
                    id={open ? 'currency' : undefined}
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
                    PaperProps={{
                        style: { width: isDownXS ? '100%' : 300 },
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    {currencies.map((x, i) => (
                        <MenuItem
                            className={classes.item}
                            onClick={() => {
                                setCurrency((state) =>
                                    state.some((c) => c === x) ? state.filter((c) => c !== x) : [...state, x],
                                );
                            }}
                            key={i}
                        >
                            {x}
                            {currency.some((c) => c === x) && <Check fontSize="small" color="secondary" />}
                        </MenuItem>
                    ))}
                </Popover>
            </FormGroup>
        </FormControl>
    );
};
