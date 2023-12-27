import * as React from 'react';
import { Button, Box } from '@material-ui/core';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { FB_APP_ID } from './const';

interface IProps {
    text: string;
    className?: string;
    fullWidth?: boolean;
    responseHandler: (response: any) => void;
    onClick?: () => void;
}

export const FacebookButton: React.FC<IProps> = ({
    text,
    className = '',
    fullWidth = false,
    responseHandler,
    onClick,
}) => {
    const [variant, setVariant] = React.useState<'outlined' | 'contained'>('outlined');

    return (
        <FacebookLogin
            appId={FB_APP_ID}
            fields="first_name,last_name,email,picture,gender,birthday"
            scope="public_profile, email" // need permission from fb: , user_birthday, user_gender
            callback={responseHandler}
            icon="fa-facebook"
            render={(renderProps: any) => (
                <Button
                    fullWidth={fullWidth}
                    className={className}
                    onMouseOver={() => setVariant('contained')}
                    onMouseLeave={() => setVariant('outlined')}
                    variant={variant}
                    color="secondary"
                    onClick={() => {
                        onClick?.();
                        renderProps.onClick();
                    }}
                    startIcon={<i style={{ fontSize: 16 }} className="icon-brand-facebook-f" />}
                >
                    <Box component="span" fontSize=".7rem">
                        {text}
                    </Box>
                </Button>
            )}
        />
    );
};
