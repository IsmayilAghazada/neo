import * as React from 'react';
import { Button, Box } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider, makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

const redTheme = createMuiTheme({ palette: { primary: red } });

const useStyles = makeStyles(() => ({
    label: {
        display: 'flex',
        alignItems: 'flex-start',
        textTransform: 'none',
    },
}));

interface IProps {
    text: string;
    className?: string;
    fullWidth?: boolean;
    onClick?: () => void;
}

export const GooglePlusButton: React.FC<IProps> = ({ text, className = '', fullWidth = false, onClick }) => {
    const [variant, setVariant] = React.useState<'outlined' | 'contained'>('outlined');
    const classes = useStyles();

    return (
        <MuiThemeProvider theme={redTheme}>
            <Button
                classes={{ label: classes.label }}
                fullWidth={fullWidth}
                className={className}
                onMouseOver={() => setVariant('contained')}
                onMouseLeave={() => setVariant('outlined')}
                variant={variant}
                color="primary"
                onClick={() => {
                    onClick?.();
                }}
                startIcon={<i style={{ fontSize: 16 }} className="icon-brand-google" />}
            >
                <Box style={{ display: 'flex' }} component="span" fontSize=".7rem">
                    <Box component="span">{text}</Box>
                </Box>
            </Button>
        </MuiThemeProvider>
    );
};
